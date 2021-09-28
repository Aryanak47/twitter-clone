const express = require("express");
const router = express.Router();
const User = require("../../Schemas/userSchema");
const imageHandler = require("../../utils/imageHandler");

router.get('/', async (req, res) => {
  try {
    let filter = {}
    filter = {...req.query}
    if(filter && filter.search != undefined){
      const {search} = filter
      filter = {
        $or: [
          {firstname: { $regex: search, $options: "i" }},
          {lastname: { $regex: search, $options: "i" }},
          {username: { $regex: search, $options: "i" }}
        ]
      }
    }
    const users = await User.find(filter)
    res.status(200).json({
      data:users
    })
  } catch (error) {
    res.sendStatus(500)
  }
})

router.put("/:user/follow", async (req, res, next) => {
  const id = req.params.user;
  let user = await User.findById(id);
  if (!user) {
    return res.sendStatus(401);
  }
  const followed =
    user.followers && user.followers.includes(req.session.user._id);
  const options = followed ? "$pull" : "$addToSet";
  try {
    req.session.user = await User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { [options]: { following: id } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      { _id: user._id },
      { [options]: { followers: req.session.user._id } }
    );
    res.status(200).json({
      status: 200,
      user: req.session.user,
    });
    
  } catch (error) {
    res.sendStatus(500);
    
  }
  
});

router.get("/:user/followers", async (req, res, next) => {
  const id = req.params.user;
  User.findById(id)
    .populate("followers")
    .then((results) => {
      res.status(200).json({
        status: 200,
        followers: results.followers,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
router.get("/:user/followings", (req, res, next) => {
  const id = req.params.user;
  User.findById(id)
    .populate("following")
    .then((results) => {
      res.status(200).json({
        status: 200,
        followings: results.following,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
router.post(
  "/uploadProfile",
  imageHandler.singleUpload.single('croppedImage'),
  async (req, res, next) => {
    const profilePhoto = req.body.photo
    if(!profilePhoto){
      return sendStatus(400)
    }
    try {
      const profile = "/img/users/"+profilePhoto
      req.session.user = await User.findByIdAndUpdate(req.session.user._id,{profile:profile},{new:true})
      res.sendStatus(204) 
      
    } catch (error) {
      res.sendStatus(500) 
      
    }
    
  }
);
router.post(
  "/uploadCover",
  imageHandler.singleUpload.single('croppedImage'),
  async (req, res, next) => {
    const coverPhoto = req.body.photo
    if(!coverPhoto){
      return sendStatus(400)
    }
    try {
      const cover = "/img/users/"+coverPhoto
      req.session.user = await User.findByIdAndUpdate(req.session.user._id,{cover:cover},{new:true})
      res.sendStatus(204)  
        
    } catch (error) {
      res.sendStatus(500)  
    }
  }
);

module.exports = router;
