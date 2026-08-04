import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productsRoutes from './products.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import contactRoutes from './contact.routes.js';
import ordersRoutes from './orders.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/contact', contactRoutes);
router.use('/orders', ordersRoutes);

export default router;
