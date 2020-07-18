//Importing files
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("colors");
const cloudinary = require("cloudinary").v2;
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const hpp = require("hpp");
const path = require("path");
const ejs = require("ejs");
var cron = require("node-cron");
const axios = require("axios");
const winston = require("winston");
require("winston-mongodb");
const upload = require("express-fileupload");

//Middlewares
dotenv.config({ path: "./config/config.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(helmet());

app.use(hpp());
app.use(morgan("dev"));
app.use(
  upload({
    useTempFiles: true,
  })
);

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// server rendering using ejs
app.set("view engine", "ejs");
app.set("views", "views");
app.set("static", path.join(__dirname, "/public/assets"));

//Mongoose need variable set
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

//connecting to db
connectDB();
const fetchNewsFronNyt = require("./utils/croneOperations");
//crone request
if (process.env.NODE_ENV === "production") {
  cron.schedule("* * */23 * * *", () => {
    fetchNewsFronNyt();
  });
}
// if (process.env.NODE_ENV === "development") {
//   cron.schedule("*/10 * * * * *", () => {
//     fetchNewsFronNyt();
//   });
// }

const auth = require("./routes/auth");
const user = require("./routes/user");
const video = require("./routes/video");
const blog = require("./routes/blog");
const notifications = require("./routes/notifications");
const errorHandler = require("./middleware/error");
const commonRoutes = require("./routes/common");
//Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/youtube", video);
app.use("/api/v1/blogs", blog);
app.use("/api/v1/notifications", notifications);
app.use("/api/v1", commonRoutes);
app.use("/check", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.use("/", (req, res, next) => {
  res.status(200).send({ success: true, message: "server up" });
});
app.use(errorHandler);

//Exception handling
process.on("uncaughtException", (err, promise) => {
  console.log(`error: ${err.message}`);
  process.exit(1);
});

//umhandled exception
process.on("unhandledRejection", (err, promise) => {
  console.log(`error : ${err.message}`.red.bold);
  process.exit(1);
});
module.exports = app;
