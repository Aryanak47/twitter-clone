const express = require('express');
const router = express.Router()
const User = require("../Schemas/userSchema")
const bcrypt = require("bcrypt")


router.get("/", (req,res,next) => {
    res.status(200).render("register")
   
})

router.post("/", async (req,res,next) => {
    const firstName = req.body.firstName.trim()
    const lastName = req.body.lastName.trim()
    const username = req.body.username.trim()
    const email = req.body.email.trim()
    const password = req.body.password
    let payload = req.body
    payload.title = "register"
    if(firstName && lastName && email && password && username){
        const data = req.body;
        const user = await User.findOne({
            $or:[
                { email: data.email },
                { username: data.username }
            ]
        })
        .catch(err => {
            payload.errorMessage = "Something went wrong"
            res.status(200).render("register", payload )

        })
        if(user){
            if(user.email === data.email){
                payload.errorMessage = "User already exists with this email"
            }else{
                payload.errorMessage = "User already exists with this username"
            }
            res.status(200).render("register", payload )

        }else{
            data.password = await bcrypt.hash(data.password,10)
            data.passwordConf = undefined
            User.create(data) 
            .then((usr) =>{
                if(usr){
                    req.session.user = usr
                }
                return res.redirect("/" )
            })
        }
    }else{
        payload.errorMessage = "Make sure you have provided valid field value"
        res.status(200).render("register", payload )
    }
})

module.exports = router
