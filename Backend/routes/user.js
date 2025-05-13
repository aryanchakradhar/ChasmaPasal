const express = require("express");
const {
  registerUser,
  authUser,
  getAllDoctors,
  deleteDoctor,
  sendVerifyOtp,
  verifyEmail,
  sendResetOtp,
  resetPassword
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/register").post(registerUser)
router.post("/login", authUser);
router.route("/doctors").get(getAllDoctors);
router.delete("/doctor/:doctorId", deleteDoctor);
router.post("/send-verify-otp",sendVerifyOtp);
router.post("/verify-email", verifyEmail);
router.post("/send-reset-otp",sendResetOtp);
router.post("/reset-password",resetPassword);

module.exports = router;