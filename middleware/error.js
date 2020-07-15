const ErrorResponse = require("../utils/errorResponse");
const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.MongoDB({
      db:
        process.env.NODE_ENV === "development"
          ? process.env.DEV_DB_URL
          : process.env.PROD_DB_URL,
      level: "error",
    }),
  ],
});
logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);
const errorHandler = (err, req, res, next) => {
  let error = {
    success: false,
    code: 500,
    message: "server error",
  };
  //
  console.log("error name", err.name);
  console.log("error", err);

  //token invalid
  if (err.name === "SyntaxError") {
    error.success = false;
    error.code = 400;
    error.message = err.message;
  }

  if (err.name === "JsonWebTokenError") {
    error.success = false;
    error.code = 401;
    // error.message = err.message || "Invalid Token";
    error.message = "Invalid Token";
  }
  if (err.name === "TokenExpiredError") {
    error.success = false;
    error.code = 400;
    // error.message = err.message || "Invalid Token";
    error.message = "Link expired || token expired";
  }

  //duplicate key error
  if (err.name === "MongoError") {
    error.success = false;
    error.code = 400;
    error.message = " duplicate key error";
  }

  //validation error
  if (err.name === "ValidationError") {
    error.success = false;
    error.code = 400;
    error.message = Object.values(err.errors)
      .map((value) => value.message)
      .join(",");
  }
  // custom thron error
  if (err.name === "Error") {
    error.success = false;
    error.code = err.status;
    error.message = err.message;
  }
  // mongo object Id error
  if (err.name === "CastError") {
    error.success = false;
    error.code = 500;
    error.message = err.message;
  }
  logger.log("error", {
    message: error.message,
    code: error.code,
    route: req.url,
    date:
      new Date().getDate() +
      "/" +
      new Date().getMonth() +
      "/" +
      new Date().getFullYear() +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds(),
  });

  res.status(error.code).send(error);
};

module.exports = errorHandler;
