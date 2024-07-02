import express from 'express';
import cors from 'cors';
import logger from 'morgan';

// Import routes
import userRouter from '../route/userRoute.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// Use routes
app.use('/api', userRouter);

export default app; 