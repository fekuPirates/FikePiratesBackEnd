const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "maximum length shuld be 100"],
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
