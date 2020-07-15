const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Notification = require("../models/Notification");

module.exports.getAllNotifications = asyncHandler(async (req, res, next) => {
  const results = await Notification.find();
  res.send({
    success: true,
    code: 200,
    count: results.length,
    result: results,
  });
});

module.exports.deleteNotificationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await Notification.findByIdAndRemove(id);
  if (!result) {
    return next(new ErrorResponse("Notification Not found", 404));
  }
  res.send({
    success: true,
    code: 200,
    result: undefined,
    message: "notification deleted successfully",
  });
});
module.exports.createNotification = asyncHandler(async (req, res, next) => {
  const { title, type, description, expiryDate } = req.body;

  const notification = new Notification({
    title,
    type,
    description,
    expiryDate,
  });
  await notification.save();
  res.status(200).send({
    success: true,
    code: 200,
    message: "notification created successfully",
    result: notification,
  });
});
module.exports.updateNotificationById = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  await notification.save();
  res.status(200).send({
    success: true,
    code: 200,
    message: "notification updated successfully",
    result: notification,
  });
});
