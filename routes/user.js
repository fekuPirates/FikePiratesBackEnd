const express = require("express");
const router = express.Router();

const { authorize, protect } = require("../middleware/auth");
const {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
  verifyEmail,
  sendVerifyEmail,
  forgotPassword,
  changePassword,
  updateUserPassword,
  getCurrentUser,
  changePasswordServerRender,
  verifyEmailServerRender,
  uploadProfilePhoto,
} = require("../controllers/user");

const { profilePhotoUpload } = require("../utils/upload");

router.post(
  "/me/uploadProfilePhoto",
  protect,
  profilePhotoUpload,
  uploadProfilePhoto
);
router.get("/me", protect, getCurrentUser);
router.get("/:id", protect, authorize("user", "admin"), getUserById);
router.get("/", getAllUsers);
router.put("/:id", protect, authorize("admin", "user"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);
router.get("/server/verifyEmail/:token", verifyEmailServerRender);
router.get(
  "/server/changePasswordUsingLink/:token",
  changePasswordServerRender
);
router.post("/verifyEmail/:token", verifyEmail);
router.post("/changePasswordUsingLink/:token", changePassword);
router.post("/sendVerifyLink", sendVerifyEmail);
router.post("/forgotPassword/sendLink", forgotPassword);
router.post("/updatePassword", protect, updateUserPassword);
module.exports = router;
