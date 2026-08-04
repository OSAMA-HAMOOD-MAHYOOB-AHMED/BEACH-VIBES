import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Render (and most PaaS hosts) sit behind a reverse proxy — trust it so
  // req.ip reflects the real client IP for rate limiting below.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
