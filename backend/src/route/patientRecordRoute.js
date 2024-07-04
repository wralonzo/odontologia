import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerPatientRecord } from '../controller/PatientRecordController.js';

const router = express.Router();

// ENDPOINT - REGISTER PATIENT RECORD
router.post('/patient', verifyToken, registerPatientRecord);

export default router; 