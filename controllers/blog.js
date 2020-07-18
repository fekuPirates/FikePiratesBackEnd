const asyncHandler = require("../middleware/asyncHandler");
const Blog = require("../models/Blog");
const News = require("../models/News");
const ErrorResponse = require("../utils/errorResponse");

//@desc    Get All posts
//@route   GET /api/v1/getAllBlogs?category=news
//@route   GET /api/v1/getAllBlogs?category=blog
//@access  Public
module.exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  let posts;

  if (req.body.keywords && req.query.category) {
    let keywordsData = req.body.keywords.split(" ");
    posts = await Post.find({
      category: req.query.category,
      $or: [{ keywords: { $in: [...keywordsData] } }],
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName")
      .populate("allComments", "name comment createdAt -commentedOn", null, {
        sort: { createdAt: -1 },
      });
  } else if (req.query.category) {
    posts = await Post.find({ category: req.query.category })
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName")
      .populate("allComments", "name comment createdAt -commentedOn", null, {
        sort: { createdAt: -1 },
      });
  } else {
    posts = await Post.find()
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .populate("allComments", "name comment createdAt -commentedOn", null, {
        sort: { createdAt: -1 },
      });
  }
  res
    .status(200)
    .send({ success: true, code: 200, count: posts.length, posts });
});

//@desc    Get  Expert
//@route   GET /api/v1/posts/:id
//@access  Public
module.exports.getSingleBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate("createdBy", "firstName lastName")
    .populate("allComments", "name comment createdAt -commentedOn", null, {
      sort: { createdAt: -1 },
    });
  if (!blog) {
    return res.status(404).send({
      success: true,
      code: 404,
      message: `not found with this id: ${req.params.id}`,
    });
  }
  res.status(200).send({ success: true, code: 200, data: blog });
});
//@desc    Get  Expert
//@route   GET /api/v1/posts/:id
//@access  Public
module.exports.getRecommendedBlog = asyncHandler(async (req, res, next) => {
  //TODO: need to implement
});

//@desc    create post
//@route   POST /api/v1/post
//@access  Private (admin,publisher,expert)
module.exports.createNewBlog = asyncHandler(async (req, res, next) => {
  const {
    category,
    keywords,
    shortDescription,
    imgUrl,
    videoUrl,
    title,
    data,
  } = req.body;
  const post = new Post({
    title,
    imgUrl,
    videoUrl,
    keywords,
    shortDescription,
    category,
    data: data,
    createdBy: req.user._id,
  });

  await post.save();
  res.status(201).send({
    success: true,
    code: 201,
    message: "Created new post",
    data: post,
  });
});

//@desc    delete post
//@route   DELETE /api/v1/posts/:id
//@access  Private
module.exports.deleteBlogById = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndRemove(req.params.id);

  if (!post)
    return res
      .status(404)
      .send({ success: false, code: 404, message: "post not found" });

  res.status(200).send({
    success: true,
    code: 200,
    message: "post deleted successfully",
    data: {},
    // data: expert
  });
});

//@desc    update  courses
//@route   PUT /api/v1/posts/:id
//@access  Private
module.exports.updateblogById = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post)
    return res
      .status(404)
      .send({ success: false, code: 404, message: "Post not found" });

  // console.log(typeof post._id
  // console.log(typeof req.user._id
  const x = post._id.toString();
  const y = req.user._id.toString();

  if (x !== y && req.user.role.toString() !== "admin") {
    return res.status(401).send({
      success: false,
      code: 401,
      message: `${req.user._id} not authorize to update this post`,
    });
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({ success: true, code: 200, post });
  return "hello";
});
//@desc    comment on blog
//@route   PUT /api/v1/posts/:id
//@access  Private
module.exports.onComment = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorResponse("Post Not found", 404));
  //TODO: need to finish
});
