import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { slugify } from '../utils/slugify.js';

const router = Router();

router.use(requireAuth, requireAdmin);

const PRODUCT_FIELDS = [
  'name',
  'name_ar',
  'category',
  'price',
  'tone',
  'image',
  'material',
  'rating',
  'reviews',
  'is_new',
  'is_signature',
  'description',
  'description_ar',
  'notes',
  'notes_ar',
];

function pickProductFields(body) {
  const fields = {};
  for (const key of PRODUCT_FIELDS) {
    if (body[key] !== undefined) fields[key] = body[key];
  }
  return fields;
}

// ============================================================
// Products
// ============================================================

router.post('/products', async (req, res, next) => {
  try {
    const fields = pickProductFields(req.body);

    if (!fields.name || !fields.category || fields.price == null || !fields.material) {
      return res.status(400).json({ error: 'name, category, price, and material are required' });
    }

    const id = req.body.id ? slugify(req.body.id) : slugify(fields.name);
    if (!id) {
      return res.status(400).json({ error: 'Could not derive a valid product id from the name' });
    }

    const { data: existing } = await supabase.from('products').select('id').eq('id', id).maybeSingle();
    if (existing) {
      return res.status(409).json({ error: `A product with id "${id}" already exists` });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({ id, ...fields })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const fields = pickProductFields(req.body);

    const { data: product, error } = await supabase
      .from('products')
      .update(fields)
      .eq('id', req.params.id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const { error, count } = await supabase
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', req.params.id);

    if (error) {
      if (error.code === '23503') {
        return res
          .status(409)
          .json({ error: 'Cannot delete: this product appears in existing orders' });
      }
      throw error;
    }
    if (!count) return res.status(404).json({ error: 'Product not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ============================================================
// Orders
// ============================================================

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'cancelled'];

router.get('/orders', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ orders: data });
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${ORDER_STATUSES.join(', ')}` });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select('*, order_items(*)')
      .maybeSingle();

    if (error) throw error;
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// Contact messages & newsletter subscribers
// ============================================================

router.get('/contact-messages', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ messages: data });
  } catch (err) {
    next(err);
  }
});

router.get('/newsletter-subscribers', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ subscribers: data });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// Users / roles
// ============================================================

router.get('/users', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ users: data });
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'role must be "customer" or "admin"' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', req.params.id)
      .select('id, email, first_name, last_name, role, created_at')
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
