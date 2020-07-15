const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  deleteNotificationById,
  createNotification,
  updateNotificationById,
} = require("../controllers/notifications");
const { protect, authorize } = require("../middleware/auth");
router.get("/all", getAllNotifications);
router.delete("/:id", protect, authorize("admin"), deleteNotificationById);
router.put("/:id", protect, authorize("admin"), updateNotificationById);
router.post("/", protect, authorize("admin"), createNotification);

module.exports = router;
