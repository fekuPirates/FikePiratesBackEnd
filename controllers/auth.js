const asyncHandler = require("../middleware/asyncHandler");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const axios = require("axios");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const { verifyMailText } = require("../utils/staticText");

//@desc    Register User
//@route   GET /api/v1/auth/signout
//@access  Private
module.exports.signOut = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.params.id,
    { token: null },
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(200)
    .send({ success: true, code: 200, message: "successfully logOut" });
});

//@desc    Register User
//@route   GET /api/v1/auth/signup
//@access  Public
module.exports.signUp = asyncHandler(async (req, res, next) => {
  const { redirectUrl } = req.body;
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    userInfo: req.body.userInfo,
  });

  const checkEmail = await User.findOne({ email: req.body.email });

  if (checkEmail) {
    next(new ErrorResponse("Email already exist", 400));
  }

  const hashedPassword = crypto
    .createHash("sha256", 10)
    .update(req.body.password)
    .digest("hex");
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

  const token = user.generateAuthToken();
  user.emailVerifyToken = _verifyEmailToken;
  user.password = hashedPassword;
  user.token = token;
  await user.save();
  res.status(201).send({
    success: true,
    code: 201,
    message: "Account created successfully",
    user: _.pick(user, [
      "_id",
      "name",
      "email",
      "userInfo",
      "token",
      "createdAt",
      "emailVerified",
      "role",
      "updatedAt",
      "profilePhoto",
    ]),
  });
  let html = verifyMailText(text);

  sendMail(req.body.email, subject, html)
    .then((sent) => {
      console.log("email sent successfully");
    })
    .catch(async (err) => {
      console.log(err);
    });
});

//@desc    Register User
//@route   GET /api/v1/auth/signin
//@access  Private
module.exports.signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorResponse("Invalid email or password || email not found", 400)
    );
  }

  const hashedPassword = crypto
    .createHash("sha256", 10)
    .update(req.body.password)
    .digest("hex");

  if (hashedPassword !== user.password) {
    return next(
      new ErrorResponse("invalid email or password || password incorrect", 400)
    );
  }

  const token = user.generateAuthToken();
  user.token = token;
  await user.save();
  res.status(200).send({
    success: true,
    code: 200,
    user: _.pick(user, [
      "_id",
      "name",
      "email",
      "userInfo",
      "token",
      "createdAt",
      "updatedAt",
      "profilePhoto",
      "emailVerified",
      "role",
    ]),
  });
});
//@desc    Register User
//@route   GET /api/v1/auth/signin/facebook
//@access  Public
module.exports.signInUsingFacebook = asyncHandler(async (req, res, next) => {
  const { email, id, name } = req.body;
  // const graphUrl = `https://graph.facebook.com/v7.0/me?access_token=${accessToken}&fields=id%2Cname`;
  // let fetchedData = await fetch(graphUrl, {
  //   method: "GET",
  // });
  // fetchedData = await fetchedData.json();

  if (!id || !email || !name) {
    return next(new ErrorResponse("please add email, id, name fields", 400));
  }

  // if (!email) {
  //   next(
  //     new ErrorResponse("Email not attatched in your facebook account", 400)
  //   );
  // }
  let user = await User.findOne({ email: email });
  if (!user) {
    //new user
    const newUser = new User({
      email: email,
      name: name,
    });

    const hashedPassword = crypto
      .createHash("sha256", 10)
      .update(id + process.env.JWT_SECRET)
      .digest("hex");
    const token = newUser.generateAuthToken();
    newUser.token = token;
    newUser.password = hashedPassword;
    await newUser.save();
    res.status(200).send({
      success: true,
      code: 200,
      message: "successfully registered and sign in",
      user: _.pick(newUser, [
        "_id",
        "name",
        "email",
        "userInfo",
        "token",
        "emailVerified",
        "createdAt",
        "updatedAt",
        "role",
      ]),
    });
  } else {
    //existing user

    const token = user.generateAuthToken();
    user.token = token;
    await user.save();
    res.status(200).send({
      success: true,
      code: 200,
      message: "successfully sign in",
      user: _.pick(user, [
        "_id",
        "name",
        "email",
        "userInfo",
        "token",
        "emailVerified",
        "createdAt",
        "updatedAt",
        "role",
      ]),
    });
  }
});
//@desc    Register User
//@route   GET /api/v1/auth/signin/google
//@access  Public
module.exports.signInUsingGoogle = asyncHandler(async (req, res, next) => {
  // console.log(req.body.googleAuth.accessToken);
  // const tokenInfo = await client.getTokenInfo(req.body.googleAuth.accessToken);
  // console.log(tokenInfo);
  const { tokenId } = req.body;
  const userInfo = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT,
  });
  const data = { ...userInfo };
  if (data.payload) {
    const user = await User.findOne({ email: data.payload.email });
    if (!user) {
      //new user
      const newUser = new User({
        email: data.payload.email,
        emailVerified: data.payload.email_verified,
        name: data.payload.name,
        profilePhoto: data.payload.picture,
      });
      let token = newUser.generateAuthToken();
      const hashedPassword = crypto
        .createHash("sha256", 10)
        .update(data.payload.email + process.env.JWT_SECRET)
        .digest("hex");

      newUser.password = hashedPassword;
      newUser.token = token;

      await newUser.save();
      return res.status(200).send({
        success: true,
        code: 200,
        message: "successfully registered and sign in",
        user: _.pick(newUser, [
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
    } else {
      //already registered
      token = user.generateAuthToken();
      user.token = token;
      await user.save();
      res.status(200).send({
        success: true,
        code: 200,
        message: "successfully sign in",
        user: _.pick(user, [
          "_id",
          "name",
          "email",
          "userInfo",
          "token",
          "createdAt",
          "updatedAt",
          "role",
        ]),
      });
    }
  } else {
    next(new ErrorResponse("Something went wrong try again later", 400));
  }

  //check for email in db

  // if email exists give login token

  // if not exists then register the user and send token
  //create password
});

//@desc    Register User
//@route   GET /api/v1/auth/signup/github
//@access  Public
module.exports.signInUsingGithub = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      next(new ErrorResponse("Please add code field", 400));
      return;
    }
    let collectedGitUserData = {
      img_url: "",
      email: "",
      username: "",
      emailVerified: false,
    };
    const response = {};

    const getAccess_token_Url = "https://github.com/login/oauth/access_token?";
    const get_github_user_url = "https://api.github.com/user";

    let access_token = await axios.post(
      `${getAccess_token_Url}client_id=${process.env.GITHUB_CLIENT_ID}&code=${code}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
    );

    access_token.data.split("&").map((key, index) => {
      response[key.split("=")[0]] = key.split("=")[1];
    });
    if (response && response.error) {
      next(new ErrorResponse("Invalid code, please try again", 400));
      return;
    } else if (response && response.access_token) {
      access_token = response.access_token;
    }

    let userResponse = await axios.get(get_github_user_url, {
      headers: {
        Authorization: "token " + access_token, //the token is a variable which holds the token
      },
    });

    if (userResponse.data && userResponse.data.id) {
      collectedGitUserData = {
        ...collectedGitUserData,
        img_url: userResponse.data.avatar_url,
        username: userResponse.data.login,
      };
    }

    userResponse = await axios.get(get_github_user_url + "/emails", {
      headers: {
        Authorization: "token " + access_token,
      },
    });

    if (Array.isArray(userResponse.data)) {
      collectedGitUserData = {
        ...collectedGitUserData,
        emailVerified: userResponse.data[0].verified,
        email: userResponse.data[0].email,
      };
    }

    _GithubAuth(collectedGitUserData, req, res, next);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
//helper function for signin using github
_GithubAuth = asyncHandler(async (data, req, res, next) => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    console.log("new user");
    const newUser = new User({
      email: data.email,
      emailVerified: data.emailVerified,
      name: data.username,
      profilePhoto: data.img_url,
    });

    let token = newUser.generateAuthToken();
    const hashedPassword = crypto
      .createHash("sha256", 10)
      .update(data.email + process.env.JWT_SECRET)
      .digest("hex");

    newUser.password = hashedPassword;
    newUser.token = token;

    await newUser.save();
    return res.status(201).send({
      success: true,
      code: 201,
      message: "successfully registered",
      user: _.pick(newUser, [
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
  } else {
    //already registered
    console.log("Existing user");
    token = user.generateAuthToken();
    user.token = token;
    await user.save();
    res.status(200).send({
      success: true,
      code: 200,
      message: "successfully log in",
      user: _.pick(user, [
        "_id",
        "name",
        "email",
        "userInfo",
        "emailVerified",
        "profilePhoto",
        "token",
        "createdAt",
        "updatedAt",
        "role",
      ]),
    });
  }
});
