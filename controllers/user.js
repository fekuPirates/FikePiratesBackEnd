const asyncHandler = require("../middleware/asyncHandler");
const _ = require("lodash");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const { verifyMailText, resetMailText } = require("../utils/staticText");

//@desc    current user
//@route   GET /api/v1/users/me
//@access  Private
module.exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return next(
      new ErrorResponse("Invalid session, Please login again! ", 400)
    );

  res.status(200).send({
    success: true,
    code: 200,
    user: _.pick(user, [
      "_id",
      "name",
      "emailVerified",
      "role",
      "profilePhoto",
      "email",
      "userInfo",
      "token",
      "createdAt",
      "updatedAt",
    ]),
  });
});
//@desc    Register User
//@route   GET /api/v1/users/:id
//@access  Private
module.exports.getUserById = asyncHandler(async (req, res, next) => {
  const x = req.params.id.toString();
  const y = req.user._id.toString();

  if (x !== y && req.user.role.toString() !== "admin") {
    return res.status(401).send({
      success: false,
      code: 401,
      message: `Not authorize to get user detail of id ${req.params.id}`,
    });
  }

  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorResponse(`User not found with this id ${req.params.id}`, 404)
    );

  res.status(200).send({
    success: true,
    code: 200,
    user: _.pick(user, ["_id", "name", "email", "profilePhoto", "userInfo"]),
  });
});

//@desc    Register User
//@route   GET /api/v1/users
//@access  Private admin
module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: { $ne: "admin" } })
    .select("-token -password -resetPasswordToken -emailVerifyToken")
    .sort("firstName");

  res
    .status(200)
    .send({ success: true, code: 200, count: users.length, users });
});

//@desc    Delete User
//@route   DELEtE /api/v1/users/:id
//@access  Private/Admin
module.exports.deleteUser = asyncHandler(async (req, res, next) => {
  user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return next(
      new ErrorResponse(`User not found with this id ${req.params.id}`, 404)
    );
  res.status(200).send({
    success: true,
    code: 200,
    message: "User deleted successfully",
    data: user,
  });
});

//@desc    Update User
//@route   PUT /api/v1/users/:id
//@access  Private/Admin-user
module.exports.updateUser = asyncHandler(async (req, res, next) => {
  const x = req.params.id.toString();
  const y = req.user._id.toString();

  if (x !== y && req.user.role.toString() !== "admin") {
    return res.status(401).send({
      success: false,
      code: 401,
      message: `Not authorize to update the user detail of id ${req.params.id}`,
    });
  }
  delete req.body.password;
  delete req.body.email;
  delete req.body.token;
  delete req.body._id;
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user)
    return next(
      new ErrorResponse(`User not found with this id ${req.params.id}`, 404)
    );
  res.status(200).send({
    success: true,
    code: 200,
    user: _.pick(user, [
      "_id",
      "name",
      "email",
      "profilePhoto",
      "userInfo",
      "emailVerified",
      "createdAt",
      "updatedAt",
      "role",
    ]),
  });
});

module.exports.verifyEmailServerRender = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/verifyEmail.html"));
};

module.exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_SECRET);
    //check for user exist or not
    console.log(token);
    let user = await User.findById(decoded.id);
    if (!user) {
      next(new ErrorResponse("Cannot verify email, user does not exist", 400));
    }
    if (user.emailVerified) {
      next(new ErrorResponse("Email is already verified", 400));
    }
    user = await User.findByIdAndUpdate(
      decoded.id,
      {
        emailVerifyToken: null,
        emailVerified: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).send({
      success: true,
      code: 200,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error.message);
    if (error.message === "jwt expired") {
      return next(
        new ErrorResponse(
          "Email verifiaction link expired, send link again",
          400
        )
      );
    } else if (error.message === "jwt malformed") {
      return next(
        new ErrorResponse(
          "Invalid perameter in link, please send link again",
          400
        )
      );
    } else {
      return next(
        new ErrorResponse("Something went wrong try again later", 400)
      );
    }
  }
};

module.exports.sendVerifyEmail = asyncHandler(async (req, res, next) => {
  const { email, redirectUrl } = req.body;
  let user = await User.findOne({ email: email });
  if (!req.body.email) {
    next(new ErrorResponse("Please add an email", 400));
  }
  if (!user)
    return new ErrorResponse("User found with this email address", 400);
  else if (user.emailVerified)
    next(new ErrorResponse("Email is already verifed", 400));

  const _verifyEmailToken = jwt.sign(
    { id: user._id },
    process.env.VERIFY_EMAIL_SECRET,
    {
      expiresIn: "10min",
    }
  );
  let subject = "Public auth Verify your Email";
  let text =
    redirectUrl || `${req.headers.host}/api/v1/users/server/verifyEmail`;
  text = process.env.connectionMode + "://" + text + `/${_verifyEmailToken}`;

  user.emailVerifyToken = _verifyEmailToken;
  await user.save();

  let html = verifyMailText(text);

  sendMail(email, subject, html)
    .then(async (sent) => {
      res.status(200).send({
        success: true,
        code: 200,
        message: "Verification link sent successfully",
      });
      user.verifyEmailToken = null;
      await user.save();
    })
    .catch(async (err) => {
      next(new ErrorResponse("Something went wrong, try again later", 500));
      user.verifyEmailToken = null;
      await user.save();
    });
});

module.exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email, redirectUrl } = req.body;
  //check for valid email
  if (!email) {
    next(new ErrorResponse("Please add an email", 400));
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    next(new ErrorResponse("Email not found", 404));
    return;
  }

  //generate reset password token
  const _forgotPasswordToken = jwt.sign(
    { id: user._id },
    process.env.FORGOT_PASSWORD_SECRET,
    {
      expiresIn: "10min",
    }
  );

  let text =
    redirectUrl ||
    `${req.headers.host}/api/v1/users/server/changePasswordUsingLink`;
  text = process.env.connectionMode + "://" + text + `/${_forgotPasswordToken}`;

  let subject = "Reset password using link";
  user.resetPasswordToken = _forgotPasswordToken;

  await user.save();
  let html = resetMailText(text);
  sendMail(email, subject, html)
    .then(async (sent) => {
      res.status(200).send({
        success: true,
        code: 200,
        message: "Reset password link send successfully",
      });
    })
    .catch(async (err) => {
      next(new ErrorResponse("Something went wrong, try again later", 500));
    });
});

module.exports.changePasswordServerRender = asyncHandler(
  async (req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/resetPassword.html"));
  }
);

module.exports.changePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;

    // check for user exist or not
    const decoded = jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET);

    let user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 400));
    } else if (!user.resetPasswordToken) {
      return next(new ErrorResponse("Please send reset password link", 400));
    } else if (user.resetPasswordToken.toString() !== token.toString()) {
      return next(
        new ErrorResponse(
          "Invalid token in link, please send reset password link again",
          400
        )
      );
    }

    const hashedPassword = crypto
      .createHash("sha256", 10)
      .update(newPassword)
      .digest("hex");
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.token = null;
    await user.save();
    res.status(200).send({
      success: true,
      code: 200,
      message: "Password reset successfully, Please login again",
    });
  } catch (error) {
    if (error.message === "jwt expired") {
      next(
        new ErrorResponse("Password reset link expired, send link again", 400)
      );
    }
  }
};

module.exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword) {
    return next(new ErrorResponse("Please add oldPassword Field", 400));
  } else if (!newPassword) {
    return next(new ErrorResponse("Please add newPassword Field", 400));
  } else if (newPassword.length < 5) {
    return next(
      new ErrorResponse("newPassword should be atleast 5 characters", 400)
    );
  }

  const hashedPassword = crypto
    .createHash("sha256", 10)
    .update(req.body.oldPassword)
    .digest("hex");

  console.log(req.user);
  if (hashedPassword.toString() !== req.user.password) {
    return next(new ErrorResponse("old password is not correct", 400));
  }

  const newHashedPassword = crypto
    .createHash("sha256", 10)
    .update(req.body.newPassword)
    .digest("hex");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: newHashedPassword,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).send({
    success: true,
    code: 200,
    message: "Password updated successfully",
  });
});

module.exports.uploadProfilePhoto = asyncHandler(async (req, res, next) => {
  const result = req.result;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePhoto: result.url,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).send({
    success: true,
    code: 200,
    message: "Profile photo uploaded successfully",
    user: _.pick(user, [
      "_id",
      "name",
      "email",
      "profilePhoto",
      "userInfo",
      "token",
      "emailVerified",
      "createdAt",
      "updatedAt",
      "role",
    ]),
  });

  const tmpDirPath = path.join(__dirname, "../", "tmp");
  if (fs.existsSync(tmpDirPath)) {
    const files = fs.readdirSync(tmpDirPath);
    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(tmpDirPath + "/" + filename).isDirectory()) {
          removeDir(tmpDirPath.join(__dirname, "../", "tmp") + "/" + filename);
        } else {
          fs.unlinkSync(tmpDirPath + "/" + filename);
        }
      });
      fs.rmdirSync(tmpDirPath);
    } else {
      fs.rmdirSync(tmpDirPath);
    }
  } else {
    console.log("Directory path not found.");
  }
});
