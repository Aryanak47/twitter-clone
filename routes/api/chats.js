const express = require('express');
const router = express.Router()
const Chat = require("../../Schemas/chatSchema")
const User = require("../../Schemas/userSchema")
const Message = require("../../Schemas/messageSchema")
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
    try {
        await Chat.create(data)
        res.sendStatus(202)
    } catch (error) {
        res.sendStatus(500)
        
    }

   
   
})

router.get("/",async (req, res, next) => {
    Chat.find({users :{$elemMatch: {$eq:req.session.user._id}}})
    .sort({updatedAt : -1})
    .populate("users",'-email -password')
    .populate("lastMessage")
    .then(async chats =>{
        chats = await User.populate(chats,{path:"lastMessage.sendBy"})
        res.status(200).json({chats})
    }).catch(err =>{
        res.sendStatus(500)
    })

})
router.get("/:chatId",async (req, res, next) => {
    Chat.findOne({_id:req.params.chatId,users :{$elemMatch: {$eq:req.session.user._id}}})
    .populate("users",'-email -password')
    .then(chat =>{
        res.status(200).json({chat})
    }).catch(err =>{
        res.sendStatus(500)
    })

})
router.get("/:chatId/messages",async (req, res, next) => {
    Message.find({chat:req.params.chatId})
    .populate("sendBy")
    .then(async message =>{
        res.status(200).send(message)
    }).catch(err =>{
        res.sendStatus(500)
    })

})

router.put("/:chatId",async (req, res, next) => {
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