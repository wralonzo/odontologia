import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerPatient } from '../controller/PatientController.js';

const router = express.Router();

// ENDPOINT - REGISTER PATIENT RECORD
router.post('/patient', verifyToken, registerPatient);

export default router; 