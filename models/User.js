const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a firstName"],
      maxlength: [32, "max character 32"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 5,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user", "publisher"],
        default: "user",
      },
      default: "user",
    },
    token: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    emailVerifyToken: {
      type: String,
      default: null,
    },
    facebookUrl: {
      default: null,
      type: String,
      trim: true,
    },
    twitterUrl: {
      type: String,
      default: null,
      trim: true,
    },
    linkedInUrl: {
      type: String,
      default: null,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: "assets/image/default-user-preview.png",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
