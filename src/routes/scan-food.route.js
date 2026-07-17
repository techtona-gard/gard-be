import { Router } from 'express';
import { scanFood } from '../controllers/scan-food.controller.js';

const router = Router();

router.post('/', scanFood);

export { router as scanFoodRouter };
