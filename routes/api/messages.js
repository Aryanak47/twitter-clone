const express = require('express');
const router = express.Router()
const Message = require("../../Schemas/messageSchema")
const User = require("../../Schemas/userSchema")
const Chat = require("../../Schemas/chatSchema")


router.post("/", async (req,res,next) => {
    const info = {
        sendBy:req.session.user._id,
        content:req.body.content,
        chat:req.body.chat
    }
    try {
        let result = await Message.create(info)
        result = await User.populate(result,{path:"sendBy"})
        result = await Chat.populate(result,{path:"chat"})
        Chat.findByIdAndUpdate(req.body.chat,{lastMessage:result})
        .catch(err => console.log(err))
        res.status(200).send(result)
        
    } catch (error) {
        res.sendStatus(500)
        
    }
   
   
   
})






module.exports = router;