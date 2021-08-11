const express = require('express');
const router = express.Router()
const User = require("../Schemas/postSchema")



router.get("/", async (req,res,next) => {
    const {id} = req.params
    if(!id) return res.status(400)
    res.status(200).render("postReply",{
        user:req.session.user,
        userJs:JSON.stringify(req.session.user),
        pageTitle:"View Post",
        postInfo:id
    })
   
})


module.exports = router
