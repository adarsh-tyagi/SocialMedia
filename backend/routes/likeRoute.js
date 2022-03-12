const express = require("express");
const {
  toggleLike,
  getPostLikes,
  getUserLikes,
} = require("../controllers/likeController");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

// likes routes
router.route("/toggle").post(authMiddleware, toggleLike);
router.route("/post/:postId").get(authMiddleware, getPostLikes);
router.route("/me").get(authMiddleware, getUserLikes);

module.exports = router;
