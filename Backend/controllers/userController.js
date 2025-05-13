const User = require("../models/user");
const { generateToken } = require("../config/generateToken");
const transporter = require("../config/nodeMailer");
const bcrypt = require("bcrypt");

// Utility function to handle errors
const handleErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ message });
};

// Utility function to validate required fields
const validateRequiredFields = (fields, res) => {
  for (let field of fields) {
    if (!field.value) {
      handleErrorResponse(res, 400, `Please enter all required fields: missing ${field.name}`);
      return false;
    }
  }
  return true;
};

const registerUser = async (req, res) => {
  let body = req.body;
  if (!body.role) body = { ...body, role: "user" };

  try {
    if (body.role === "doctor") {
      const { firstName, lastName, email, password, role, medicalLicense, specialization } = body;
      
      if (!validateRequiredFields(
        [{name: 'firstName', value: firstName}, {name: 'lastName', value: lastName}, {name: 'email', value: email}, {name: 'password', value: password}, {name: 'medicalLicense', value: medicalLicense}, {name: 'specialization', value: specialization}], res
      )) return;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return handleErrorResponse(res, 400, "User already exists");
      }

      const user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
        medicalLicense,
        specialization,
        isAccountVerified: false // added verification status
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
         
        });
      } else {
        handleErrorResponse(res, 400, "Failed to create user");
      }
    } else {
      const { firstName, lastName, email, password, role } = body;
      
      if (!validateRequiredFields(
        [{name: 'firstName', value: firstName}, {name: 'lastName', value: lastName}, {name: 'email', value: email}, {name: 'password', value: password}], res
      )) return;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return handleErrorResponse(res, 400, "User already exists");
      }

      const user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
        isAccountVerified: false // added verification status
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id), // token with no verification yet
        });
      } else {
        handleErrorResponse(res, 400, "Failed to create user");
      }
    }
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isAccountVerified) {
        return handleErrorResponse(res, 403, "Please verify your email before logging in");
      }

      res.status(200).json({
        _id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        image_url: user.image_url,
        token: generateToken(user._id),
      });
    } else {
      handleErrorResponse(res, 401, "Invalid email or password");
    }
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};

const getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return handleErrorResponse(res, 400, 'No User found');
    }
    req.user = user;
    next();
  } catch (err) {
    handleErrorResponse(res, 400, err.message || 'No User found');
  }
};

const isAuthenticated = (req, res, next) => {
  let checker = req.auth && req.user && req.auth._id == req.user._id;
  if (!checker) {
    return handleErrorResponse(res, 403, 'Authenticated Access Denied');
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return handleErrorResponse(res, 403, 'Admin Access Denied');
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.send(doctors);
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};

const updateUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const filename = req.file.filename;
    const url = `${req.protocol}://${req.get('host')}/uploads/images/${filename}`;
    const user = await User.findById(userId);
    if (!user) {
      return handleErrorResponse(res, 400, 'User not found');
    }
    user.image_url = url || user.image_url;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    handleErrorResponse(res, 400, err.message || 'User Update Failed');
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return handleErrorResponse(res, 404, 'Doctor not found');
    }

    if (doctor.role !== 'doctor') {
      return handleErrorResponse(res, 403, 'Cannot delete non-doctor user');
    }

    await doctor.deleteOne();

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};


const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      html: `
        <h2>Account Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 24 hours.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);

    return res.json({ success: true, message: "Verification OTP sent to your Email" });

  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email Verified Successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const sendResetOtp = async (req, res) => {
  const {email} = req.body;

  if (!email){
    return res.json({ success: false, message: 'Email is required' });
  }

  try{
    const user = await User.findOne({ email });
    if (!user){
      return res.json({ success: false, message: 'User not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() *900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password reset OTP',
      text: `Your OTP for resetting the password is ${otp}. Use this OTP to proceed with resetting your password.`
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: 'OTP sent to your email' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Reset user password

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP, and Password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP expired' });
    }

    user.password = newPassword;    
    // Hash new password and save
    // user.password = await bcrypt.hash(newPassword, 10);
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(newPassword, salt);

    console.log("Hashed new password:", user.password); // Log hashed password to check
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get total count of all users
const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};

// Get total count of doctors only
const getDoctorCount = async (req, res) => {
  try {
    const doctorCount = await User.countDocuments({ role: "doctor" });
    res.json({ count: doctorCount });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};


module.exports = {
  registerUser,
  authUser,
  allUsers,
  getUserById,
  isAuthenticated,
  isAdmin,
  getAllDoctors,
  updateUsers,
  deleteDoctor,
  sendVerifyOtp,
  verifyEmail,
  sendResetOtp,
  resetPassword,
  getUserCount,
  getDoctorCount,
};
