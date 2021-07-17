const express = require('express');
const router = express.Router()
const Post = require("../../Schemas/postSchema")
const User = require("../../Schemas/userSchema")
const imageHandler = require("../../utils/imageHandler")

router.get("/", async (req,res,next) => {
  try {
    let posts = await Post.find({})
    .populate("createdBy")
    .populate({
      path:"retweetData",
      populate:{
        path:"createdBy",
        model:"User"
      }
    })
    .populate({
      path:"replyTo",
      populate:{
        path:"createdBy",
        model:"User"
      }
    })
    res.status(200).json({
      status: "success",
      data:  posts
    })
  } catch (er) {
    console.log(er);
    res.sendStatus(500)
  }
 
})

router.get("/:id", async (req,res,next) => {
  try {
    const {id} = req.params
    if(!id) return res.status(400)
    const post = await Post.findOne({_id:id})
    .populate("createdBy")
    .populate({
      path:"retweetData",
      populate:{
        path:"createdBy",
        model:"User"
      }
    })
    res.status(200).json({
      status: "success",
      data:  post
    })
  } catch (er) {
    console.log(er);
    res.sendStatus(500)
  }
 
})

router.post("/",imageHandler.uploadMultiple,imageHandler.resizePostPhoto ,async (req,res,next) => {
  try {
    if(!req.body.content){
      return res.sendStatus(400)
    }
    if(req.body.replyTo){
      req.body.createdBy = req.session.user._id
    }
    let post = await Post.create(req.body)
    post = await User.populate(post, { path: "createdBy" })
  
    res.status(200).json({
        status: 'success',
        post
    })
    
  } catch (error) {
    res.sendStatus(500)
  }

})

router.put("/:post/like",async (req,res,next) => {
  try {
    const postId = req.params.post
    const userId = req.session.user._id
    if(!userId){
      return res.status(401)
    }
    const isLiked = req.session.user.likes.includes(postId)
    const option = isLiked ? "$pull" : "$addToSet"
    req.session.user = await User.findByIdAndUpdate({_id:userId},{[option] : {likes:postId}},{new:true})
    let post = await Post.findByIdAndUpdate({_id:postId},{[option] : {likes:userId}},{new:true})
    res.status(200).json({
      status: 200,
      post
    })
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
    
  }
})
router.put("/:post/retweet",async (req,res,next) => {
  try {
    const postId = req.params.post
    const userId = req.session.user._id
    if(!userId){
      return res.status(401)
    }
    // delete post if already exists
    const deletedPost = await Post.findOneAndDelete({ createdBy:userId,retweetData:postId })
    const option = deletedPost !== null ? "$pull" : "$addToSet"
    repost = deletedPost
    if(repost === null){
      repost = await Post.create({createdBy:userId,retweetData:postId })
    }
    req.session.user = await User.findByIdAndUpdate({_id:userId},{[option] : {retweet:repost._id}},{new:true})
    let post = await Post.findByIdAndUpdate({_id:postId},{[option] : {retweetUsers:userId}},{new:true})
    res.status(200).json({
      status: 200,
      post
    })
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
    
  }
})


module.exports = router
