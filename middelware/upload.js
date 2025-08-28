const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // yahan cloudinary config hona chahiye

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'myApp_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ quality: "auto" }]
  },
});

const upload = multer({ storage });
module.exports = upload;
