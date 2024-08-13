import express from 'express';
import cors from 'cors';
import logger from 'morgan';

// Import routes
import userRoute from '../route/userRoute.js'
import patientRoute from '../route/patientRoute.js'
import healthQuestionnaireRoute from '../route/healthQuestionnaireRoute.js'
import physicalEvaluationRoute from '../route/physicalEvaluationRoute.js'
import appointmentScheduleRoute from '../route/appointmentScheduleRoute.js'
import clinicalHistoryRoute from '../route/clinicalHistoryRoute.js'
import inventoryRoute from '../route/inventoryRoute.js'
import treatmentPlanRoute from '../route/treatmentPlanRoute.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// Use routes
app.use('/api', userRoute);
app.use('/api', patientRoute);
app.use('/api', healthQuestionnaireRoute);
app.use('/api', physicalEvaluationRoute);
app.use('/api', appointmentScheduleRoute);
app.use('/api', clinicalHistoryRoute);
app.use('/api', inventoryRoute);
app.use('/api', treatmentPlanRoute);

export default app; 