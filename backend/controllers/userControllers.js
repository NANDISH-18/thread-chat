import users from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import generatedTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
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

        generatedTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
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

    const {name, email, password, username, profilePic, bio}= req.body;
    const userId = req.user._id;
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
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        
        await user.save();
        res.status(200).json({message: "Profile updated successfully", user});
    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in update user', err.message);
    }

}

const getUserProfile = async (req,res) => {
    const {username} = req.params;
    try {
        const user = await users.findOne({username}).select('-password').select('-updatedAt');
        if(!user) return res.status(400).json({error: "User not found"});
        res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log('Error in get the user profile', err.message);
    }
}


export {signUpUser, loginUser, logOut,followUnFollowUser, updateUser, getUserProfile}
