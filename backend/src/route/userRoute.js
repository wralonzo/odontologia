import express from 'express'
import { registerUserAdministrator, registerUserSecretary, loginUser } from '../controller/UserController.js'

const router = express.Router();

// ENDPOINT - REGISTER USER ADMINISTRATOR
router.post('/user/administrator', registerUserAdministrator);

// ENDPOINT - REGISTER USER SECRETARY
router.post('/user/secretary', registerUserSecretary);

// ENDPOINT - LOGIN USER
router.post('/user/login', loginUser);

export default router; 