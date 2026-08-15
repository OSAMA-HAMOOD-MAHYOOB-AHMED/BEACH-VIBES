import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('currency_price_ranges').select('*').order('currency');
    if (error) throw error;
    res.json({ priceRanges: data });
  } catch (err) {
    next(err);
  }
});

export default router;
