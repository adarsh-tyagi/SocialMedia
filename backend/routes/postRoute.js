const express = require("express");
const {
  getHomePosts,
  createPost,
  deletePost,
  getPostDetails,
  getUserPost,
  getOwnPosts,
} = require("../controllers/postController");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

// post routes
router.route("/home").get(authMiddleware, getHomePosts);
router.route("/create").post(authMiddleware, createPost);
router.route("/delete/:postId").delete(authMiddleware, deletePost);
router.route("/detail/:postId").get(authMiddleware, getPostDetails);
router.route("/user/:userId").get(authMiddleware, getUserPost);
router.route("/me").get(authMiddleware, getOwnPosts);

module.exports = router;
