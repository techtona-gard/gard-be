import { Router } from 'express';
import {
  getMedicalGuidelines,
  bulkIngestGuidelines,
} from '../controllers/ai.controller.js';

const router = Router();

router.get('/medical-guidelines', getMedicalGuidelines);
router.post('/medical-guidelines/bulk', bulkIngestGuidelines);

export { router as aiRouter };
