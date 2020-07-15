const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const {
  signOut,
  signUp,
  signIn,
  signInUsingFacebook,
  signInUsingGoogle,
  signInUsingGithub,
} = require("../controllers/auth");

router.post("/signin/facebook", signInUsingFacebook);
router.post("/signin/github", signInUsingGithub);
router.post("/signin/google", signInUsingGoogle);
router.post("/signout", protect, signOut);
router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
