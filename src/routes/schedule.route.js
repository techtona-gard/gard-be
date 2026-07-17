import { Router } from 'express';
import { schedule } from '../controllers/schedule.controller.js';

const router = Router();

router.post('/', schedule);

export { router as scheduleRouter };
