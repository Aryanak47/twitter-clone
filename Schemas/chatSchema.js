const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = Schema({
    users:[{ type:Schema.Types.ObjectId,ref:"User"} ],
    lastMessage:{ type:Schema.Types.ObjectId,ref:"Message"} ,
    groupChat:{ type: Boolean,default:false},
    chatName:{ type:String,trim:true}

},{ timestamps: true })


module.exports = mongoose.model("Chat",chatSchema)