const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return next(new ErrorResponse("missing auth token | Access Denied", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //check for user exist or not
  const user = await User.findById(decoded._id);
  if (!user) {
    return next(
      new ErrorResponse(
        "invalid user id in token || not found || Access Denied => token invalid",
        401
      )
    );
  }
  if (!user.token) {
    return next(
      new ErrorResponse("Please Login again || invalid session in db", 401)
    );
  }
  // checking for validation
  if (user.token.toString() !== token.toString()) {
    return next(
      new ErrorResponse(
        "invalid user id in token || token mismatch ||Access Denied => please login again",
        401
      )
    );
  }
  req.user = user;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

//protect routh
module.exports.protect = protect;
//grant access to specific roles
module.exports.authorize = authorize;
