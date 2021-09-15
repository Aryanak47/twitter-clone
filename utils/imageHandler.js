const multer = require('multer')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed').message)
  }
};
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/users')
  },
  filename: function (req, file, cb) {
      const name = req.session.user._id+""+Date.now()+".png"
      req.body.photo = name
    cb(null,name )
  }
})

exports.singleUpload = multer({
  storage: storage,
  fileFilter: multerFilter
});

const multipleUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadMultiple = multipleUpload.fields([{ name: 'photos', maxCount: 5 }])

exports.resizePostPhoto = async (req, res, next) => {
  console.log("yeah i got a upload request !",req.files)
    if (!req.files.photos) return next();
    req.body.images = []
    await Promise.all(
        req.files.photos.map(async file => {
        file.filename = `post-${file.fieldname}-${Date.now()}.jpeg`;
        await sharp(file.buffer)
          // .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/posts/${file.filename}`);
          req.body.images.push(file.filename);
    }))
    next();
  }
