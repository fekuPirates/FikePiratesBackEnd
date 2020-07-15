const mongoose = require("mongoose");
const blogCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Please add a category"],
      maxlength: [32, "max character 32"],
      trim: true,
    },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

module.exports = BlogCategory;
