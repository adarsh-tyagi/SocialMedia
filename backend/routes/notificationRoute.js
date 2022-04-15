const express = require("express");
const {
  createNotification,
  deleteNotification,
  deleteAllNotifications,
  getNotifications,
} = require("../controllers/notificationController");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

// notifications route
router.route("/create").post(authMiddleware, createNotification);
router.route("/delete/:notificationId").delete(authMiddleware, deleteNotification);
router.route("/delete/all").get(authMiddleware, deleteAllNotifications);
router.route("/").get(authMiddleware, getNotifications);

module.exports = router;
