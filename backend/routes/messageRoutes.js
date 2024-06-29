import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getConversation, getMessages, sendMessage } from '../controllers/messageController.js';


const router = express.Router();

router.get('/conversation', protectRoute, getConversation)
router.get('/:otherUserId', protectRoute, getMessages)
router.post('/', protectRoute, sendMessage);


export default router