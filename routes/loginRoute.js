const express = require('express');
const router = express.Router()
const User = require("../Schemas/userSchema")
const bcrypt = require('bcrypt')


router.get("/", (req,res,next) => {
    res.status(200).render("login")
   
})
router.post("/", async (req,res,next) => {
    let payload = req.body
    payload.title = "login"
    try{
        if(req.body.logUserPassword && req.body.logUserName){
            const user = await User.findOne({
                $or:[
                    { email: req.body.logUserName },
                    { username: req.body.logUserName }
                ]
            })
            
            if(user != null){
                const valid = await bcrypt.compare(req.body.logUserPassword , user.password)
                if(valid){
                    req.session.user = user
                    return res.redirect("/")
                }
            }
                payload.errorMessage = "incorrect password or email"
                return res.render("login", payload )
        }
            payload.errorMessage = "Make sure you have provided valid field value"
            res.render("login", payload )
    }catch(err ) {
        payload.errorMessage = "Something went wrong"
        return res.status(200).render("login", payload )
    }

    
   
})

module.exports = router
