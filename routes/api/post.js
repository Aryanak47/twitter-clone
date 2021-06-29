const express = require('express');
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const Post = require("../../Schemas/postSchema")

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
var uploadMultiple = upload.fields([{ name: 'photos', maxCount: 4 }])



const resizePostPhoto = async (req, res, next) => {
    if (!req.files.photos) return next();
    req.body.images = []
    await Promise.all(
        req.files.photos.map(async file => {
        file.filename = `post-${file.fieldname}-${Date.now()}.jpeg`;
        await sharp(file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/posts/${file.filename}`);
          req.body.images.push(file.filename);

    }))
    next();
  }

router.get("/", (req,res,next) => {
})

router.post("/",uploadMultiple,resizePostPhoto ,async (req,res,next) => {
  if(!req.body.content){
    return res.sendStatus(400)
  }
  console.log(req.body)
  await Post.create(req.body)
  res.status(200).json({
      status: 'success'
  })
})


module.exports = router
