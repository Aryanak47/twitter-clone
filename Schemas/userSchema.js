const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
    firstName: { type: String, required: [true , "User must have a first name"], trim: true},
    lastName: { type: String, required: [true , "User must have a last name"], trim: true },
    username: { type: String, required: [true , "User must have a username"], trim: true, unique: true },
    email: { type: String, required: [true , "User must have a email"], trim: true, unique: true },
    password: { type: String, required: [true , "User must have password"] },
    profile: { type: String, default: "/img/profilepics.jpg" },
    likes:[{ type:mongoose.Schema.Types.ObjectId,ref:"Post"} ],
    retweet:[{ type:mongoose.Schema.Types.ObjectId,ref:"Post"} ],
    followers:[{ 
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    }],
    following:[{ 
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    }],
    cover: { type: String },
},{ timestamps: true })
module.exports = mongoose.model("User",userSchema)