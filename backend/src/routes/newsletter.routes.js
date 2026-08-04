import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { isValidEmail } from '../utils/validators.js';

const router = Router();

const DUPLICATE_KEY = '23505';

router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase() });

    if (error && error.code !== DUPLICATE_KEY) throw error;
    res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    next(err);
  }
});

export default router;
