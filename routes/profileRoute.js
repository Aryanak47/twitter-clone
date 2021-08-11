const express = require('express');
const router = express.Router()
const User = require("../Schemas/userSchema")




router.get("/", async (req,res,next) => {
    res.status(200).render("profilePage",{
        profile:req.session.user,
        userJs:JSON.stringify(req.session.user),
        pageTitle:req.session.user.username,
    })
   
})
router.get("/:username", async (req,res,next) => {
    const { username } = req.params
    const user = await getUser(username)
    if(!user) return res.sendStatus(400)
    res.status(200).render("profilePage",{
        profile:user,
        userJs:JSON.stringify(user),
        pageTitle:user.username
    })
})
router.get("/:username/replies", async (req,res,next) => {
    const { username } = req.params
    const user = await getUser(username)
    if(!user) return res.sendStatus(400)
    res.status(200).render("profilePage",{
        profile:user,
        userJs:JSON.stringify(user),
        pageTitle:user.username,
        selectedTab:"reply"
    })
})

const getUser = async username => {
    let user = await User.findOne( {username} )
    if(!user && !username.match(/^[0-9a-fA-F]{24}$/) ){
        return user
    }else if(!user){
        user = await  User.findById(username)
    }
    return user;
   

}

module.exports = router
