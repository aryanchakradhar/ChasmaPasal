const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const appointmentRoute = require("./routes/appointment");
const uploadFileRoute = require("./routes/uploadFile");
const orderRoute = require("./routes/order");
const reviewRoute = require("./routes/review");
const notificationRoute = require("./routes/notification");
const paymentRoute = require("./routes/payment");

dotenv.config();
const app = express();
app.use(
  "/uploads/images/",
  express.static(path.join(__dirname, "/uploads/images/"))
);
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/upload", uploadFileRoute);
app.use("/api/orders", orderRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/review", reviewRoute);
app.use("/api/khalti", paymentRoute);

//error middlewares
app.use(notFound);
app.use(errorHandler);

//connect db and start server
connectDB();

app.listen(8080, () => {
  console.log("listening on port 8080");
});
