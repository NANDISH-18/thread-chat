import users from "../models/userModel.js";
import Post from '../models/postModel.js'
import {v2 as cloudinary} from 'cloudinary'

const getPost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        res.status(200).json(post);

    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in get the post', err.message);
    }
}

const createPost = async (req,res) => {
    try {
        const {postedBy, text} = req.body;
        let {img} = req.body

        if(!postedBy || !text){
            return res.status(400).json({error: "postedBy and text fields are required"});
        }

        const user = await users.findById(postedBy);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        //if user tries to post for different user
        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "Unauthorized to create post"});
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({error: `Text length should be less than ${maxLength}`});
            
        }

        if(img){
            const uploadResoponse = await cloudinary.uploader.upload(img);
            img = uploadResoponse.secure_url;
        }

        const newPost = new Post({postedBy, text, img})

        await newPost.save();
        res.status(200).json({message: "Post created successfully", newPost});



    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in create post', err.message);
        
    }
}

const deletPost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Check if post is present or not
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        // Check if user is authorized to delete post
        if(post.postedBy.toString() !== req.user._id.toString() ){
            return res.status(401).json({error: "Unauthorized to delete post"});
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted successfully"});

        

    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in deleting the post', err.message);
    }
}

const likeUnlikePost = async (req,res) => {
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        // Find user has already liked the post
        const userLikedPost =  post.likes.includes(userId);
        if(userLikedPost){
            // unlike the post
            // Pull out the userId from like array
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked successfull"});
        }else{
            // Like post
            // Push the new userId in the likes Array
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: "Post liked successfull"});

        }

    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in like and unlike the post', err.message);
    }
} 

const replyToPost = async (req,res) => {
    try {
        const {text}= req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text){
            return res.status(400).json({error: "Please enter the reply text"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const reply = {userId, text, userProfilePic, username};
        post.replies.push(reply);
        await post.save();
        res.status(200).json({message: "Reply added successfull", post});


    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in reply to post section the post', err.message);
    }
}
const getFeedPosts = async (req,res) => {
    try {
        const userId = req.user._id;
		const user = await users.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

        if (!following || following.length === 0) {
            return res.status(200).json({ message: "No posts to show" });
        }

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);


    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in get feed of the post', err.message);
    }
}

const getUserPost = async (req,res) => {
    const { username } = req.params;
    try {
        const user = await users.findOne({username});
        if(!user){
            return res.status(400).json({error: 'User not found'});
        }
        
        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in get the user post', err.message);
    }
}

export {createPost, getPost, deletPost, likeUnlikePost, replyToPost, getFeedPosts, getUserPost}



