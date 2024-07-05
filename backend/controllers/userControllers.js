import users from "../models/userModel.js";
import post from '../models/postModel.js'
import bcrypt from 'bcryptjs'
import generatedTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from 'cloudinary'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
const signUpUser = async (req,res) => {
    try {
        const {name, email, username, password} = req.body;
        const user = await users.findOne({$or:[{username, email}]});
        // console.log('Received sign-up data:', { name, email, username, password });


        if(user){
            return res.status(400).json({error: "User already exists"});
        }

        // Hash the passeword
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = new users({
            name,
            email,
            username,
            password: hashPassword,
        });
        await newUser.save();

        if(newUser){
            generatedTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            })
        }else{
            res.status(400).json({error: "Invalid user data"})
        }

    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in signUp user', err.message);
    }
}

const loginUser = async (req,res)=>{
    try {

        const {username, password} = req.body;
        const user = await users.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid credentials"});
        }

        if(user.isFrozen){
            user.isFrozen = false;
            await user.save();
        }

        generatedTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        })

        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in login user', err.message);
    }
}

const logOut = async (req,res) => {
    try {
        res.cookie("jwt", {}, {maxAge:'1'});
        res.status(200).json({message: "User logged out successfully"});
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in logout user', err.message);
    }
}

const followUnFollowUser = async (req,res) => {
    try {
        //extract id from route 
        const {id} = req.params;
        const userToModify = await users.findById(id);
        const currentUser = await users.findById(req.user._id);

        if(id=== req.user._id.toString()) return res.status(400).json({error: "You can not follow/unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(400).json({error: "User not found "});

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            // Unfollow user
            // Modify current user follwing, modify followers of userToModify
            await users.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            await users.findByIdAndUpdate(id, { $pull: {followers: req.user.id}});
            res.status(200).json({message: "User unfollowed successfully"});
        }else{
            // Follow user
            await users.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            await users.findByIdAndUpdate(id, { $push: {followers: req.user.id}});
            res.status(200).json({message: "User followed successfully"});
        }


    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in follow and unfollow user', err.message);
    }
}

const updateUser = async (req,res) => {

    const {name, email, password, username, bio}= req.body;
    let {profilePic} = req.body;
    const userId = req.user._id;
    // console.log('Updating user profile for userId:', userId);
    try {
        // Fetch the user document by ID
        let user = await users.findById(userId);
        if(!user) return res.status(400).json({message: "User not found"});

        if(req.params.id !== userId.toString()){
            return res.status(400).json({message: "You can not update other's profile"});
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;

        }
        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0]);
            }
            const uploadResoponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadResoponse.secure_url
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        // Find all posts that this user is replied and update username and userProfilePic
        await post.updateMany(
            {"replies.userId": userId},
            {
                $set:{
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic
                }
            },
            {arrayFilters: [{ "reply.userId": userId }]}
        )

        // // password should be null in response
        // user.password = null;
        

        // Generate a new token
        const token = jwt.sign({ _id: user._id }, process.env.jwtToken, { expiresIn: '1h' });

        await user.save();

        // Remove password from the response
        user = user.toObject();
        delete user.password;

        res.status(200).json({message: "Profile updated successfully", user});
    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in update user', err.message);
    }

}

const getUserProfile = async (req,res) => {
    // We will fetch the user profile either with username or userId
    //query is either username or userid
    const {query} = req.params;
    try {
        let user;
        // query is userId
        if (mongoose.Types.ObjectId.isValid(query)){
            user = await users.findOne({_id: query}).select('-password').select('-updatedAt');
            

        }else{
            user = await users.findOne({username: query}).select('-password').select('-updatedAt');
        }
        if(!user) return res.status(400).json({error: "User not found"});
        res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in get the user profile', err.message);
    }
}

const getSuggestedUsers = async (req,res) => {
    try {
        // Exclude the current user from suggested user array and exclude user that current user is already following
        const userId = req.user._id;
        // Try to find user which follow
        const userFollowedByYou = await users.findById(userId).select("following");
        // trying to fetch 10 users randomly from database
        const user = await users.aggregate([
            {
                $match: {
                    _id: {
                        $ne: userId
                    }
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])
        // filter the users which are already following
        const filteredUser = user.filter(user => !userFollowedByYou.following.includes(user._id));
        const suggestedUser = filteredUser.slice(0,4);

        suggestedUser.forEach(user => user.password = null);

        res.status(200).json(suggestedUser);


    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in get the suggestedUser', err.message);
    }
}
const freezeAccount = async (req,res) => {
    try {
        const user = await users.findById(req.user._id);
        if(!user){
            return res.status(400).json({error: "User not found"});
        }
        user.isFrozen = true;
        await user.save();
        res.status(200).json({success: true});
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in get the freezeAccount', err.message);
    }
}


export {signUpUser, loginUser, logOut,followUnFollowUser, updateUser, getUserProfile, getSuggestedUsers, freezeAccount}
