const express = require('express');
const router = express.Router()
const User = require("../Schemas/userSchema")




router.get("/", async (req,res,next) => {
    res.status(200).render("profilePage",{
        profile:req.session.user,
        userJs:JSON.stringify(req.session.user),
        logedIn:req.session.user._id,
        pageTitle:req.session.user.username,
    })
   
})
router.get("/:username", async (req,res,next) => {
    const { username } = req.params
    const user = await getUser(username)
    if(!user) return res.sendStatus(400)
    res.status(200).render("profilePage",{
        profile:user,
        userJs:JSON.stringify(req.session.user),
        logedIn:req.session.user._id,
        pageTitle:user.username,
    })
})
router.get("/:username/replies", async (req,res,next) => {
    const { username } = req.params
    const user = await getUser(username)
    if(!user) return res.sendStatus(400)
    res.status(200).render("profilePage",{
        profile:user,
        userJs:JSON.stringify(req.session.user),
        pageTitle:user.username,
        selectedTab:"reply",
        logedIn:req.session.user._id,
    })
})

router.get("/:username/following", async (req,res,next) => {
    const { username } = req.params
    const user = await getUser(username)
    if(!user) return res.sendStatus(400)
    res.status(200).render("follow",{
        profile:user,
        userJs:JSON.stringify(req.session.user),
        logedIn:req.session.user._id,
        pageTitle:"Follow",
        selectedTab:"following",
    })
})
router.get("/:username/followers", async (req,res,next) => {
    const { username } = req.params
    const user = await getUser(username)
    if(!user) return res.sendStatus(400)
    res.status(200).render("follow",{
        profile:user,
        userJs:JSON.stringify(req.session.user),
        logedIn:req.session.user._id,
        pageTitle:"Follow"
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
