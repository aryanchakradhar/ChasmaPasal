const express = require("express")
const mongoose = require('mongoose')
const dotenv = require("dotenv");
const cors = require("cors")
const connectDB = require("./config/db");

const app = express()
dotenv.config();
app.use(express.json())
app.use(cors())

//connect db and start server
connectDB();


app.listen(5000, () => {
  console.log("listening on port 5000");
});
