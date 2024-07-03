import express from 'express'
import { registerUser, loginUser, userList } from '../controller/UserController.js'

const router = express.Router();

// ENDPOINT - REGISTER USER
router.post('/user', registerUser);

// ENDPOINT - LOGIN USER
router.post('/user/login', loginUser);

// ENDPOINT - USER LIST
router.get('/user', userList);

export default router; 