import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerTreatmentPlan, updateTreatmentPlan, deleteLogicallyTreatmentPlan, treatmentPlanList } from '../controller/TreatmentPlanController.js';

const router = express.Router();

// ENDPOINT - REGISTER TREATMENT PLAN
router.post('/treatment-plan', verifyToken, registerTreatmentPlan);

// ENDPOINT - UPDATE TREATMENT PLAN
router.put('/treatment-plan/:id', verifyToken, updateTreatmentPlan);

// ENDPOIN - DELETE TREATMENT PLAN
router.patch('/treatment-plan', verifyToken, deleteLogicallyTreatmentPlan);

// ENDPOINT - TREATMENT PLAN LIST
router.get('/treatment-plan', verifyToken, treatmentPlanList);

export default router; 