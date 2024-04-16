import express from 'express';
import { addPost, getPost, deletePost, updatePost } from '../controllers/postController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // Adjust the path as needed
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Post routes with authMiddleware
router.post('/', authMiddleware, upload.single('file'), addPost);
router.get('/:id', authMiddleware, getPost);
router.delete('/:id', authMiddleware, deletePost);
router.put('/:id', authMiddleware, updatePost);

export default router;
