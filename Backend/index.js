const express = require("express");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require('body-parser');

const userRoute = require("./routes/user");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express()
dotenv.config();
app.use(express.json())
app.use(helmet());
app.use(cors())
app.use(bodyParser.json())

//routes
app.use("/api/user", userRoute);

//error middlewares
app.use(notFound);
app.use(errorHandler);

//connect db and start server
connectDB();


app.listen(8080, () => {
  console.log("listening on port 8080");
});
