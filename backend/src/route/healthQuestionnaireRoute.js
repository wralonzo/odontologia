import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerHealthQuestionnaire, updateHealthQuestionnaire, deleteLogicallyHealthQuestionnaire, findHealthQuestionnaireByPatientId } from '../controller/HealthQuestionnaireController.js';

const router = express.Router();

// ENDPOINT - REGISTER HEALTH QUESTIONNARIE
router.post('/health-questionnarie', verifyToken, registerHealthQuestionnaire);

// ENDPOINT - UPDATE HEALTH QUESTIONNARIE
router.put('/health-questionnarie/:id', verifyToken, updateHealthQuestionnaire);

// ENDPOIN - DELETE HEALTH QUESTIONNARIE
router.patch('/health-questionnarie', verifyToken, deleteLogicallyHealthQuestionnaire);

// ENDPOIN - DELETE HEALTH QUESTIONNARIE
router.get('/health-questionnarie/:patient_id', verifyToken, findHealthQuestionnaireByPatientId);


export default router; 