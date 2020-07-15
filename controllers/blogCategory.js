const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const BlogCategory = require("../models/BlogCategory");

module.exports.getAllBlogCategories = asyncHandler(async (req, res, next) => {
  const results = await BlogCategory.find();
  res.send({
    success: true,
    code: 200,
    count: results.length,
    result: results,
  });
});

module.exports.deleteblogCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await BlogCategory.findByIdAndRemove(id);
  if (!result) {
    return next(new ErrorResponse("Category Not found", 404));
  }
  res.send({
    success: true,
    code: 200,
    result: undefined,
    message: "Blog Category deleted successfully",
  });
});
module.exports.createNotification = asyncHandler(async (req, res, next) => {
  const { categoryName } = req.body;

  const newBlogCategory = new BlogCategory({
    categoryName,
  });
  await newBlogCategory.save();
  res.status(200).send({
    success: true,
    code: 200,
    message: "Blog category created successfully",
    result: newBlogCategory,
  });
});
module.exports.updateBlogCategoryById = asyncHandler(async (req, res, next) => {
  let blogCategory = await BlogCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  await notification.save();
  res.status(200).send({
    success: true,
    code: 200,
    message: "Blog Category updated successfully",
    result: blogCategory,
  });
});
