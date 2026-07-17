import { Router } from 'express';
import { createLifestyle } from '../controllers/lifestyle.controller.js';

const router = Router();

router.post('/', createLifestyle);

export { router as lifestyleRouter };
