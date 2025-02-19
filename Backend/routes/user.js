const express = require("express");
const {
  registerUser,
  authUser,
  getAllDoctors
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/register").post(registerUser)
router.post("/login", authUser);
router.route("/doctors").get(getAllDoctors);

module.exports = router;