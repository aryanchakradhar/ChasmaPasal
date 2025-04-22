const express = require('express');
const { upload } = require('../config/fileConfig');

const { updateUsers } = require('../controllers/userController');
const router = express.Router();

//Post
router.route('/users/:userId').post(upload.single('file'), updateUsers);

module.exports = router;