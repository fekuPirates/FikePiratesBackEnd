const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"],
    default: null,
  },
  subsection: {
    type: String,
    trim: true,
    default: null,
  },
  byLine: {
    type: String,
    trim: true,
    default: null,
  },
  abstract: {
    type: String,
    trim: true,
    required: [true, "Please add a short description"],
    default: null,
  },
  imgUrl: {
    type: String,
    trim: true,
    required: [true, "Please add a image"],
    default: null,
  },
  more_url: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  publishedAt: {
    type: Date,
  },
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
