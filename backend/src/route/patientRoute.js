import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerPatient, updatePatient, deleteLogicallyPatient, patientList } from '../controller/PatientController.js';

const router = express.Router();

// ENDPOINT - REGISTER PATIENT
router.post('/patient', verifyToken, registerPatient);

// ENDPOINT - UPDATE PATIENT
router.put('/patient/:id', verifyToken, updatePatient);

// ENDPOIN - DELETE LOGICALLY PATIENT
router.patch('/patient', verifyToken, deleteLogicallyPatient);

// ENDPOINT - PATIENT LIST
router.get('/patient', verifyToken, patientList);

export default router;