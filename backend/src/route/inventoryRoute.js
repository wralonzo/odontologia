import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerInventory, updateInventory, deleteLogicallyInventory, inventoryList } from '../controller/InventoryController.js';

const router = express.Router();

// ENDPOINT - REGISTER INVENTORY
router.post('/inventory', verifyToken, registerInventory);

// ENDPOINT - UPDATE INVENTORY
router.put('/inventory/:id', verifyToken, updateInventory);

// ENDPOIN - DELETE INVENTORY
router.patch('/inventory', verifyToken, deleteLogicallyInventory);

// ENDPOINT - INVENTORY LIST
router.get('/inventory', verifyToken, inventoryList);

export default router; 