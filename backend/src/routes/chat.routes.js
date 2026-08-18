import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { genAI } from '../lib/gemini.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

// Public, unauthenticated, and backed by an external API call per message —
// throttle harder than the login/register limiter.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please wait a bit before continuing the chat.' },
});

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
// Rolling alias for Google's current stable Flash model — the line with a
// genuine free tier — so this doesn't need updating as models roll over.
const MODEL = 'gemini-flash-latest';

const SYSTEM_PROMPT_BASE = `You are the shopping assistant for Beach Vibes, an online store selling swimwear, beachwear, footwear, swimming equipment, water sports gear, beach essentials, and accessories.

Only help with things related to Beach Vibes: product questions, sizing and material advice, recommendations from the catalog below, shipping, returns, and general beach/swim/travel advice that's relevant to shopping here. If asked about something unrelated (general knowledge, coding help, other stores, etc.), politely say that's outside what you can help with here and steer back to how you can help with their beach or swim trip.

When recommending products, only recommend items that appear in the catalog below — never invent a product, price, or availability. Prices are listed in USD; the storefront converts and displays them in the visitor's local currency automatically, so don't state a price in any other currency yourself. Keep replies conversational and concise — a few sentences, not an essay.

Shipping & returns: complimentary standard shipping on all orders over $500, with Express Beach Delivery available at checkout. Unused items in original packaging may be returned within 30 days of delivery for a full refund.`;

router.post('/', chatLimiter, async (req, res, next) => {
  try {
    if (!genAI) {
      return res.status(503).json({ error: 'The AI assistant is not configured right now.' });
    }

    const { messages, language } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages is required' });
    }
    if (messages.length > MAX_MESSAGES) {
      return res.status(400).json({ error: 'This conversation has gotten long — please start a new chat.' });
    }
    for (const m of messages) {
      if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || !m.content.trim()) {
        return res.status(400).json({ error: 'Invalid message format' });
      }
      if (m.content.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ error: 'Message is too long' });
      }
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('name, category, price, material, description')
      .order('created_at', { ascending: true });

    if (productsError) throw productsError;

    const catalogText = (products || [])
      .map((p) => `- ${p.name} (${p.category}, ${p.material}, $${p.price}): ${p.description || ''}`)
      .join('\n');

    const languageInstruction =
      language === 'ar'
        ? 'Respond in Arabic unless the visitor writes to you in a different language.'
        : 'Respond in English unless the visitor writes to you in a different language.';

    const systemInstruction = `${SYSTEM_PROMPT_BASE}\n\n${languageInstruction}\n\nCurrent catalog:\n${catalogText}`;

    // Gemini's assistant-turn role is 'model', not 'assistant'.
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let response;
    try {
      response = await genAI.models.generateContent({
        model: MODEL,
        contents,
        config: { systemInstruction, maxOutputTokens: 1024 },
      });
    } catch (apiErr) {
      // Log the real cause (rate limit, quota, ...) server-side, but never
      // relay raw upstream API error internals to chat users.
      console.error('Gemini API error:', apiErr);
      return res.status(502).json({ error: 'The AI assistant is temporarily unavailable. Please try again in a moment.' });
    }

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
      return res.json({
        reply: "I can't help with that one, but I'm happy to help you find something for your next beach or swim trip!",
      });
    }

    res.json({ reply: response.text || '' });
  } catch (err) {
    next(err);
  }
});

export default router;
