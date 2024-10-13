import mongoose from 'mongoose'
const messageSchema = mongoose.Schema({
    sender : {
        type: mongoose.Schema.ObjectId,
        ref : "User"
    },
    message : {
        type: String,
        trim: true,
    },
    chatId :{
        type: mongoose.Schema.ObjectId,
        ref: 'Chat'
    },
    
},
{
    timestamps: true
});

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;