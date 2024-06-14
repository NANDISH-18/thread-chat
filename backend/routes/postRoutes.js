import express from 'express';
import { createPost, deletPost, getFeedPosts, getPost, getUserPost, likeUnlikePost, replyToPost } from '../controllers/postController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();
router.get('/feed', protectRoute, getFeedPosts);
router.get('/:id', getPost);
router.get('/user/:username', getUserPost);
router.post('/create', protectRoute ,createPost)
router.delete('/:id', protectRoute ,deletPost)
router.put('/like/:id', protectRoute ,likeUnlikePost)
router.put('/reply/:id', protectRoute ,replyToPost);



export default router;