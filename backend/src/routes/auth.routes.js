import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../lib/supabase.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { isValidEmail } from '../utils/validators.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Brute-force protection: register/login are the only unauthenticated
// endpoints that touch a password, so they're the ones worth throttling.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.toLowerCase();

    const { data: existing, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(password);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: normalizedEmail,
        password_hash: passwordHash,
        first_name: firstName || null,
        last_name: lastName || null,
      })
      .select('id, email, first_name, last_name, role, created_at')
      .single();

    if (error) throw error;

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, first_name, last_name, role')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    delete user.password_hash;
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updates = {};

    if (firstName !== undefined) updates.first_name = firstName || null;
    if (lastName !== undefined) updates.last_name = lastName || null;

    if (email !== undefined) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'A valid email is required' });
      }
      const normalizedEmail = email.toLowerCase();

      const { data: existing, error: lookupError } = await supabase
        .from('users')
        .select('id')
        .eq('email', normalizedEmail)
        .neq('id', req.user.id)
        .maybeSingle();

      if (lookupError) throw lookupError;
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }
      updates.email = normalizedEmail;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No changes provided' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, email, first_name, last_name, role, created_at')
      .single();

    if (error) throw error;
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
