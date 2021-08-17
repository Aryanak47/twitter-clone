const multer = require('multer')
const sharp = require('sharp')

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
exports.uploadMultiple = upload.fields([{ name: 'photos', maxCount: 5 }])



exports.resizePostPhoto = async (req, res, next) => {
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
