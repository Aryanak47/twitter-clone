const express = require("express");
const router = express.Router();


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

module.exports = router;