import express from 'express';
import { createPost, deletPost, getPost } from '../controllers/postController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/:id', getPost);
router.post('/create', protectRoute ,createPost)
router.post('/:id', protectRoute ,deletPost)

export default router;