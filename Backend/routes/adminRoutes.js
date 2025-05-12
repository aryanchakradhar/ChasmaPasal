const express = require("express");
const router = express.Router();

const { 
  getUserCount, 
  getDoctorCount 
} = require("../controllers/userController");
const { getProductCount } = require("../controllers/productController");
const { getOrderCount } = require("../controllers/orderController");
const { getReviewCount } = require("../controllers/doctorReviewController");
const { getAppointmentCount } = require("../controllers/appointmentController");

// Routes with /api prefix
router.get("/products", getProductCount);
router.get("/doctors", getDoctorCount);
router.get("/users", getUserCount);
router.get("/appointments", getAppointmentCount);
router.get("/orders", getOrderCount);
router.get("/reviews", getReviewCount);

module.exports = router;