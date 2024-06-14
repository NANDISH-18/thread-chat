import express from 'express';
import { followUnFollowUser, getUserProfile, logOut, loginUser, signUpUser, updateUser } from '../controllers/userControllers.js';
import protectRoute from '../middleware/protectRoute.js';


const router = express.Router();

router.get("/profile/:query", getUserProfile)
router.post("/signup", signUpUser)
router.post("/login", loginUser)
router.post("/logout", logOut);
router.post("/follow/:id", protectRoute ,followUnFollowUser);
router.put("/update/:id", protectRoute ,updateUser);

export default router;

