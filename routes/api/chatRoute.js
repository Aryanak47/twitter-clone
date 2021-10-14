const express = require('express');
const router = express.Router()
const Chat = require("../../Schemas/chatSchema")



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

module.exports = router;