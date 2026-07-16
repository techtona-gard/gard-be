import { Router } from 'express';
import { healthRouter } from './health.route.js';

const router = Router();

// Register sub-routes
router.use('/health', healthRouter);

export { router as apiRouter };
