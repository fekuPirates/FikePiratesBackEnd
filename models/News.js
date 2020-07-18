const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a title"],
      maxlength: [32, "max character 32"],
      trim: true,
    },
    subsection: {
      type: String,
      trim: true,
      maxlength: [50, "maximum length shuld be 50"],
      required: [true, "Please add a subsection"],
    },
    btLine: {
      type: String,
      trim: true,
      required: [true, "Please add a byLine"],
    },
    abstract: {
      type: String,
      trim: true,
      maxlength: [5000, "maximum length shuld be 5000"],
      required: [true, "Please add a short description"],
    },
    imgUrl: {
      type: String,
      trim: true,
      required: [true, "Please add a image"],
      trim: true,
    },
    more_url: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;
