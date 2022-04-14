const catchAsyncError = require("../middlewares/catchAsyncError");
const Notification = require("../models/notificationModel");
const ErrorHandler = require("../utils/errorHandler");

// create notification
exports.createNotification = catchAsyncError(async (req, res, next) => {
  const { receiverId, content } = req.body;
  const notification = await Notification.create({
    receiver: receiverId,
    content,
    sender: req.user._id,
  });
  res.status(201).json({ success: true, notification });
});

// delete notification
exports.deleteNotification = catchAsyncError(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.body.notificationId,
  });
  if (!notification) {
    return next(new ErrorHandler("No such notification exists", 400));
  }
  await notification.remove();
  res.status(200).json({ success: true, message: "Notification removed" });
});

// delete all notifications
exports.deleteAllNotifications = catchAsyncError(async (req, res, next) => {
  await Notification.deleteMany({ receiver: req.user._id });
  res
    .status(200)
    .json({ success: true, message: "All your notifications removed" });
});

// get all notification for user
exports.getNotifications = catchAsyncError(async (req, res, next) => {
  const notifications = await Notification.find({ receiver: req.user._id })
    .populate("sender")
    .limit(10)
    .sort({ created_at: -1 });
  res.status(200).json({ success: true, notifications });
});
