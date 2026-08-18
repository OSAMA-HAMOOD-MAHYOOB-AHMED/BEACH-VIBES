import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';

// null when ANTHROPIC_API_KEY isn't set — callers must check before use.
export const anthropic = env.anthropicApiKey ? new Anthropic({ apiKey: env.anthropicApiKey }) : null;
