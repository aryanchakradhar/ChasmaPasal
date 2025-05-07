const express = require("express");
const router = express.Router();
const {
  createOrderForPayment,
  initializeKhaltiPayment,
  verifyKhaltiPayment,
  khaltiWebhook,
} = require("../controllers/khalti");

// Khalti Payment Routes
router.post("/payment", createOrderForPayment, initializeKhaltiPayment);
router.post("/verify", verifyKhaltiPayment);
router.get("/webhook", khaltiWebhook);

module.exports = router;
