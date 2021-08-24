const express = require('express');
const router = express.Router()
const User = require("../../Schemas/userSchema")

router.put('/:user/follow',async (req, res, next) => {
    const id = req.params.user
    let user = await User.findById(id)
    if(!user){
        return res.sendStatus(401)
    }
    const followed = user.followers && user.followers.includes(req.session.user._id)
    const options = followed  ? "$pull" : "$addToSet"
    req.session.user = await User.findByIdAndUpdate({_id: req.session.user._id},{[options] : {following:id}},{new:true})
    await User.findByIdAndUpdate({_id:user._id},{[options] : {followers:req.session.user._id}})
    res.status(200).json({
        status: 200,
        user:req.session.user
      })
})

module.exports = router
