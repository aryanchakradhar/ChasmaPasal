const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    medicalLicense: {
      type: String,
      required: false,
    },
    specialization: {
      type: String,
      required: false,
    },
    image_url: {
      type: String,
      required: false,
    },
    verifyOtp: {
      type: String,
      default: '',
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: '',
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
