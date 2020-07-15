const express = require("express");
const router = express.Router();

const {
  getVideosOfPlayList,
  getChannelDetails,
  getSingleVideoById,
  getAllPlayList,
} = require("../controllers/video");

router.get("/playList/videos", getVideosOfPlayList);
router.get("/playList/all", getAllPlayList);
router.get("/channel/details", getChannelDetails);
router.get("/video/:id", getSingleVideoById);

module.exports = router;
