const cloudinary = require("cloudinary").v2;
const path = require("path");

async function profilePhotoUpload(req, res, next) {
  try {
    const file = req.files.file;
    const filename = `profile-${req.user._id}`;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Public-auth-profile-photo",
      public_id: filename,
    });

    req.result = result;
    req.filename = `${result.public_id}${path.extname(result.url)}`;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports.profilePhotoUpload = profilePhotoUpload;
