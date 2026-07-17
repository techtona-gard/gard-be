import { Router } from 'express';
import {
  createHistory,
  getHistoriesByUserId,
  deleteHistory,
} from '../controllers/history.controller.js';

const router = Router();

router.post('/', createHistory);
router.get('/user/:userId', getHistoriesByUserId);
router.delete('/:id', deleteHistory);

export { router as historyRouter };
