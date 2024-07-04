import mongoose  from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    lastMessage: {
        text: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        seen: {
            type: Boolean,
            default: false,
        },
    }

},{
    timestamps: true
})

const Conversation = mongoose.model("Conversation", conversationSchema );

export default Conversation;
