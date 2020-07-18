const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const ErrorResponse = require("../utils/errorResponse");
router.post("/contactus", async (req, res, next) => {
  const { email, message } = req.body;
  if (!email || !message) {
    next(new ErrorResponse("Please add all files i.e email and message"));
  }
  try {
    const newContact = new Contact({
      email,
      message,
    });
    await newContact.save();
    res.send({
      success: true,
      code: 200,
      result: [],
      message: "your feed sent successfully",
    });
  } catch (error) {}
});
router.post("/subscribeUs", async (req, res, next) => {
  //TODO need to implement
});

module.exports = router;
