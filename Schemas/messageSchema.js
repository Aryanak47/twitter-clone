const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const messageSchema =  Schema({
    readBy:[{ type:Schema.Types.ObjectId,ref:"User"} ],
    chat:{ type:Schema.Types.ObjectId,ref:"Chat"} ,
    content:{ type: String,trim:true},
    sendBy:{ type:Schema.Types.ObjectId,ref:"User"}
},{ timestamps: true })

module.exports =  mongoose.model("Message",messageSchema)