const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
// const {
//   updateblogById,
//   deleteBlogById,
//   createNewBlog,
//   getSingleBlog,
//   getRecommendedBlog,
//   getAllBlogs,
// } = require("../controllers/video");

router.put("/:id", protect, authorize("admin", "publisher"), updateblogById);
router.delete("/:id", protect, authorize("admin"), deleteBlogById);
router.delete(
  "/:id/comment",
  protect,
  authorize("admin", "authorize", "user"),
  onComment
);
router.post("/", protect, authorize("admin", "publisher"), createNewBlog);
router.get("/:id", getSingleBlog);
router.get("/recommended", getRecommendedBlog);
router.get("/", getAllBlogs);

module.exports = router;
