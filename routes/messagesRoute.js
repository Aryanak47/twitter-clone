const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const Chat = require("../Schemas/chatSchema")
const User = require("../Schemas/userSchema")


router.get("/", (req,res,next) => {
    res.status(200).render("inboxPage",{
        logedIn:req.session.user,
        userJs:JSON.stringify(req.session.user),
        pageTitle:"Inbox",
    })
})
router.get("/new", (req,res,next) => {
    res.status(200).render("newInboxPage",{
        logedIn:req.session.user,
        userJs:JSON.stringify(req.session.user),
        pageTitle:"New Message",
    })
})
router.get("/:chatId", async (req,res,next) => {
    const chatid = req.params.chatId
    const user = req.session.user._id
    const isValidId = mongoose.isValidObjectId(chatid)
    const payload = {
        logedIn:req.session.user,
        userJs:JSON.stringify(req.session.user),
        pageTitle:"Chat",
    }
    if(!isValidId){
        payload.errorMessage = "You don't have permission or chat does not exist."
        return res.status(200).render("chatPage",payload)
    }
    let chat = await Chat.findOne({_id:chatid,users:{$elemMatch:{$eq:user}}})
    .populate("users")
    if(chat == null){
        const userFound = await User.findById(chatid)
        if(userFound != null){
            chat = getChatByUser(userFound._id,user)
        }
    }
    if(chat == null){
        payload.errorMessage = "You don't have permission or chat does not exist."
    }else{
        payload.chat = chat
    }
    res.status(200).render("chatPage",payload)
})

async function getChatByUser(userLogedIn,otherUser){
    return await Chat.findOneAndUpdate({
        groupChat:false,
        users:{
            $size:2,
            $all:[
                {$elemMatch:{$eq:userLogedIn}},
                {$elemMatch:{$eq:otherUser}}
            ]
        },
    },{
            $setOnInsert:{
            users:[userLogedIn,otherUser]
        }
    }, 
    { 
        upsert: true ,
        new: true
    }).populate("users")
}

module.exports = router;