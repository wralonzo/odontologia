import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerPatient } from '../controller/PatientController.js';

const router = express.Router();

// ENDPOINT - REGISTER PATIENT
router.post('/patient', verifyToken, registerPatient);

// ENDPOINT - UPDATE PATIENT
router.put('/patient/:id', verifyToken, updateUser);

// ENDPOIN - DELETE LOGICALLY PATIENT
router.patch('/patient', verifyToken, deleteLogicallyUser);

// ENDPOINT - PATIENT LIST
router.get('/patient', verifyToken, userList);

export default router;