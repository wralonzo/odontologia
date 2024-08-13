import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerTreatment } from '../controller/TreatmentController.js';

const router = express.Router();

// ENDPOINT - REGISTER TREATMENT
router.post('/treatment', verifyToken, registerTreatment);

export default router; 