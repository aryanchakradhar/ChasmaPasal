const express = require("express");
const router = express.Router();
const { uploadFile } = require("../controllers/uploadFileController");
const { upload } = require("../config/fileConfig"); // Import multer config

// Route to upload a file and return the file URL (used for generic file uploads)
router.post("/", upload.single("file"), uploadFile);

module.exports = router;
