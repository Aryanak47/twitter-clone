const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = Schema({
    content:{ type: String,trim:true},
    createdBy:{ type:Schema.Types.ObjectId,ref:"User"},
    pinned:Boolean,
    images:[String],
    likes:[{ type:Schema.Types.ObjectId,ref:"User"} ],
    retweetUsers:[{ type:Schema.Types.ObjectId,ref:"User"} ],
    retweetData:{ type:Schema.Types.ObjectId,ref:"Post"} ,
},{ timestamps: true })


module.exports = mongoose.model("Post",postSchema)