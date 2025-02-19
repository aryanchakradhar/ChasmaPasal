const User = require("../models/user");
const { generateToken } = require("../config/generateToken");

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

      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
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
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
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
      res.status(201).json({
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
    const url = `${req.protocol}://${req.get('host')}/images/${filename}`;
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

module.exports = {
  registerUser,
  authUser,
  allUsers,
  isAuthenticated,
  isAdmin,
  getUserById,
  getAllDoctors,
  updateUsers
};
