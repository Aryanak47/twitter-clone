const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{ type: String,trim:true},
    createdBy:{ type:mongoose.Types.ObjectId,ref:"User"},
    pinned:Boolean,
    images:[String]
    
},{ timestamps: true })


module.exports = mongoose.model("Post",postSchema)