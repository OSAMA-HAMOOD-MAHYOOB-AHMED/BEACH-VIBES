import 'dotenv/config';

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Optional — not in `required` above, so the rest of the API still works
  // without it. The chat route itself returns a friendly "not configured"
  // response when this is unset, rather than the whole server failing to boot.
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  // Comma-separated list, e.g. "https://beach-vibes.vercel.app,https://beach-vibes.app"
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim()),
};
