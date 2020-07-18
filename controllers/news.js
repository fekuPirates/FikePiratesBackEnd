const asyncHandler = require("../middleware/asyncHandler");
const News = require("../models/News");

module.exports.getAllNews = asyncHandler(async (req, res, next) => {
  const newss = await News.find();
  res.send({
    success: true,
    code: 200,
    count: newss.length,
    result: newss,
  });
});
