const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  updateblogById,
  deleteBlogById,
  createNewBlog,
  getSingleBlog,
  getRecommendedBlog,
  getAllBlogs,
  onComment,
} = require("../controllers/blog");
const { getAllNews } = require("../controllers/news");

router.put("/:id", protect, authorize("admin", "publisher"), updateblogById);
router.delete("/:id", protect, authorize("admin"), deleteBlogById);
router.delete("/:id/comment", protect, onComment);
router.post("/", protect, authorize("admin", "publisher"), createNewBlog);
router.get("/recommended", getRecommendedBlog);
router.get("/blogs", getAllBlogs);
router.get("/news", getAllNews);
router.get("/:id", getSingleBlog);

module.exports = router;
