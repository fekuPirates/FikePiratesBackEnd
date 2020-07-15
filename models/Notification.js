const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      maxlength: [32, "max character 32"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["video", "offer", "annoucemnets"],
        message: "not valid type( add i.e video or offer or annoucements)",
      },
      required: [true, "Please add a notification Type"],
    },
    imgUrl: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
