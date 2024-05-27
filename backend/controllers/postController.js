import users from "../models/userModel.js";
import Post from '../models/postModel.js'

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
        const {postedBy, text, img} = req.body;

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

        const newPost = new Post({postedBy, text, img})

        await newPost.save();
        res.status(201).json({message: "Post created successfully", newPost});



    } catch (err) {
        res.status(500).json({message: err.message})
        console.log('Error in create post', err.message);
        
    }
}

export {createPost, getPost}

