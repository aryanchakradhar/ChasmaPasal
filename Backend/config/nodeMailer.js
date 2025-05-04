require('dotenv').config(); // Optional, adds safety if this file is imported before index.js runs dotenv
const nodemailer = require('nodemailer');

console.log("SMTP_USER:", process.env.SMTP_USER); // Debug log

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use false for port 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Failed:", error);
  } else {
    console.log("SMTP Server is ready to send emails");
  }
});

module.exports = transporter;
