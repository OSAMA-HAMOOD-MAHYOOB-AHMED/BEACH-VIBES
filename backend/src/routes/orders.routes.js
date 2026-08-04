import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one order item is required' });
    }

    const productIds = items.map((item) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', productIds);

    if (productsError) throw productsError;

    const productById = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productById.get(item.productId);
      const quantity = Number(item.quantity);

      if (!product || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: `Invalid item: ${item.productId}` });
      }

      subtotal += product.price * quantity;
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity,
      });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        email: req.user.email,
        subtotal,
        total: subtotal,
        shipping_address: shippingAddress || null,
      })
      .select('*')
      .single();

    if (orderError) throw orderError;

    const { data: insertedItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map((item) => ({ ...item, order_id: order.id })))
      .select('*');

    if (itemsError) throw itemsError;

    res.status(201).json({ order: { ...order, order_items: insertedItems } });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ orders: data });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: data });
  } catch (err) {
    next(err);
  }
});

export default router;
