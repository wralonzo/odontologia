import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerUser, loginUser, deleteLogicallyUser, userList } from '../controller/UserController.js';

const router = express.Router();

// ENDPOINT - REGISTER USER
router.post('/user', registerUser);

// ENDPOINT - LOGIN USER
router.post('/user/login', loginUser);

// ENDPOIN - DELETE LOGICALLY
router.patch('/user', verifyToken, deleteLogicallyUser);

// ENDPOINT - USER LIST
router.get('/user', verifyToken, userList);

export default router; 