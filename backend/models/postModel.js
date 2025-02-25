import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Types.ObjectId, //Id which auto generated by mongoose
        ref: 'users',
        required: true,
    },
    text: {
        type: String,
        maxLength: 500,
    },
    img :{
        type: String,

    },
    likes: {
        // array of user id
        type: [mongoose.Types.ObjectId],
        ref: 'users',
        default: []
    },
    replies: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                ref: 'users',
                required: true,
            },
            text: {
                type: String,
                required: true,

            },
            userProfilePic: {
                type: String,

            },
            username: {
                type: String,
            }
        }
    ]
}, {
    timestamps: true,
})


const post = mongoose.model('Post', postSchema);

export default post;
