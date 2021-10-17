const express = require('express');
const router = express.Router()
const Chat = require("../../Schemas/chatSchema")
const mongoose = require("mongoose")


router.post("/", async (req,res,next) => {
    let { users } = req.body
    if(!users) return res.sendStatus(400)
    users = JSON.parse(users)
    if(users.length < 0){
        return res.sendStatus(400)
    }
    users.push(req.session.user)
    const data = {
        users,
        groupChat:true
    }
    const result = await Chat.create(data)
    res.status(200).json({
        result
    })
   
   
})

router.get("/",async (req, res, next) => {
    Chat.find({users :{$elemMatch: {$eq:req.session.user._id}}})
    .sort({updatedAt : -1})
    .populate("users")
    .then(chats =>{
        res.status(200).json({chats})
    }).catch(err =>{
        res.sendStatus(500)
    })

})
router.get("/:chatId",async (req, res, next) => {
    Chat.findOne({_id:req.params.chatId,users :{$elemMatch: {$eq:req.session.user._id}}})
    .populate("users")
    .then(chat =>{
        res.status(200).json({chat})
    }).catch(err =>{
        res.sendStatus(500)
    })

})

router.put("/:chatId",async (req, res, next) => {
    console.log("as",req.body)
    const chatId = req.params.chatId
    if(!mongoose.isValidObjectId(chatId)) res.sendStatus(400)
    Chat.findByIdAndUpdate(chatId,req.body)
    .then(chats =>{
        res.sendStatus(204)
    }).catch(err =>{
        res.sendStatus(500)
    })

})

module.exports = router;