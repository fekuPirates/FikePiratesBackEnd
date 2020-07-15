const express = require("express");
const router = express.Router();
const {
  getAllBlogCategories,
  deleteblogCategoryById,
  createBlogCategory,
  updateBlogCategoryById,
} = require("../controllers/blogCategory");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getAllBlogCategories);
router.delete("/:id", protect, authorize("admin"), deleteblogCategoryById);
router.put("/:id", protect, authorize("admin"), updateBlogCategoryById);
router.post("/", protect, authorize("admin"), createBlogCategory);

module.exports = router;
