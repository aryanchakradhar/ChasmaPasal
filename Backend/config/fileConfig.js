const multer = require("multer");
const cloudinary = require("./cloudinary");

// Multer memory storage (for streaming to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Cloudinary Upload Helper
const uploadToCloudinary = (fileBuffer, folder = "chasmaPasal_uploads") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};
