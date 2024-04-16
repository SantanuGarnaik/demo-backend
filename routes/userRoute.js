import express from 'express';
import { getUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // Import authMiddleware

const router = express.Router();

// User routes
router.get('/:id', authMiddleware, getUser); // Add authMiddleware here

export default router;
