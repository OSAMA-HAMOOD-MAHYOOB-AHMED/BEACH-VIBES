import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { isValidEmail } from '../utils/validators.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !isValidEmail(email) || !message) {
      return res
        .status(400)
        .json({ error: 'First name, last name, a valid email, and a message are required' });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        message,
      })
      .select('id, created_at')
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Message received', id: data.id });
  } catch (err) {
    next(err);
  }
});

export default router;
