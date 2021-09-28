const express = require('express');
const router = express.Router();

router.get("/",(req,res) => {
    const payload = getPayload(req);
    payload.selectedTab="posts"
    res.status(200).render('search',payload)
})
router.get("/:searchRoute",(req,res) => {
    const payload = getPayload(req);
    payload.selectedTab = req.params.searchRoute 
    res.status(200).render('search',payload)
})

const getPayload = (req) => {
    return {
        userJs:JSON.stringify(req.session.user),
        logedIn:req.session.user,
        pageTitle:"Search"
    }
}


module.exports = router