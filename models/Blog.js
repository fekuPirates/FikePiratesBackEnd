const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      maxlength: [32, "max character 32"],
      trim: true,
    },
    cType: {
      type: String,
      enum: {
        values: ["news", "blog"],
        message: "not valid type( add i.e news or blog )",
      },
      required: [true, "Please add a Type post"],
    },
    shortDescription: {
      type: String,
      maxlength: [500, "maximum length shuld be 500"],
      required: [true, "Please add a short description"],
    },
    content: {
      type: String,
      maxlength: [1000000, "maximum length shuld be 100000"],
      minlength: [20, "minimum length should be 20"],
      required: [true, "Please add a blog data"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    region: {
      type: String,
      maxlength: [32, "max character 32"],
      trim: true,
    },
    imgUrl: {
      type: String,
      required: [true, "Please add a image"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    uri: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

blogSchema.virtual("allComments", {
  ref: "Comment", // db name
  localField: "_id",
  foreignField: "commentedOn",
  justOne: false,
});

const Blog = mongoose.model("Blogs", blogSchema);

module.exports = Blog;
