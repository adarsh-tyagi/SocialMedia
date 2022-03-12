const express = require("express");
const {
  followUser,
  unfollowUser,
  getMyFollowers,
  getMyFollowing,
} = require("../controllers/followController");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

// follow routes
router.route("/followother").post(authMiddleware, followUser);
router.route("/unfollowother").post(authMiddleware, unfollowUser);
router.route("/myfollowers").get(authMiddleware, getMyFollowers);
router.route("/mefollowing").get(authMiddleware, getMyFollowing);

module.exports = router;
