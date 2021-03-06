const express = require('express');
const router = express.Router()
const Post = require("../../Schemas/postSchema")
const User = require("../../Schemas/userSchema")
const imageHandler = require("../../utils/imageHandler")

router.get("/", async (req,res,next) => {
  try {
    let filter = {}
    filter = {...req.query}
    if(filter && filter.reply != undefined) {
      let reply = filter.reply == "true"
      filter.replyTo = {$exists: reply}
      delete filter.reply 
    }
    if(filter && filter.search != undefined){
      const {search} = filter
      filter.content = { $regex: search, $options: "i" }
      delete filter.search
    }
    let posts = await getPosts(filter)  
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
    if(!id) return res.sendStatus(400)
    const posts = await getPosts({_id:id})
    const post = posts[0]
    let results = {
      postData:post
    }
    if(post.replyTo !== undefined){
      results.replyTo = post.replyTo
    }
    results.replies = await getPosts({replyTo:id})


    res.status(200).json({
      status: "success",
      data:  results
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
    console.log(error)
    res.sendStatus(500)
  }

})

router.put("/:post/like",async (req,res,next) => {
  try {
    const postId = req.params.post
    const userId = req.session.user._id
    if(!userId){
      return res.sendStatus(401)
    }
    const isLiked = req.session.user.likes.includes(postId)
    const option = isLiked ? "$pull" : "$addToSet"
    req.session.user = await User.findByIdAndUpdate({_id:userId},{[option] : {likes:postId}},{new:true})
    let post = await Post.findByIdAndUpdate({_id:postId},{[option] : {likes:userId}},{new:true})
    res.status(202).json({
      status: 202,
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
    let repost = deletedPost
    if(repost === null){
      repost = await Post.create({createdBy:userId,retweetData:postId })
    }
    req.session.user = await User.findByIdAndUpdate({_id:userId},{[option] : {retweet:repost._id}},{new:true})
    let post = await Post.findByIdAndUpdate({_id:postId},{[option] : {retweetUsers:userId}},{new:true})
    res.status(202).json({
      status: 202,
      post
    })
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
    
  }
})

async function getPosts(filter){
  const post = await Post.find(filter)
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
  return post


}

router.put("/:id",async (req, res) => {
  try {
    
    const data = req.body.params
    if(data.pinned !== undefined) {
      await Post.updateMany({createdBy:req.session.user._id},{pinned:false})
    }
    await Post.findByIdAndUpdate(req.params.id,data)
    res.sendStatus(202)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
    
  }
})

router.delete('/:id', (req, res,next) => {
  const id = req.params.id
  if(!id) res.sendStatus(400)
  Post.findByIdAndDelete(id)
  .then(() =>  res.sendStatus(204))
  .catch(() => res.sendStatus(400))
 
  

})

module.exports = router
