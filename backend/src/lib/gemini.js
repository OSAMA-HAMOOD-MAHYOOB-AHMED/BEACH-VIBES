import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

// null when GEMINI_API_KEY isn't set — callers must check before use.
export const genAI = env.geminiApiKey ? new GoogleGenAI({ apiKey: env.geminiApiKey }) : null;
