const catchAsyncError = require("../middlewares/catchAsyncError");
const Follow = require("../models/followModel");
const User = require("../models/userModel");

// follow a user
exports.followUser = catchAsyncError(async (req, res, next) => {
  const { followingId } = req.body;
  const user = await User.findOne({ _id: followingId });
  await Follow.create({
    follower: req.user._id,
    following: followingId,
  });
    
  res
    .status(200)
    .json({ success: true, message: `You started following ${user.name}` });
});

// unfollow a user
exports.unfollowUser = catchAsyncError(async (req, res, next) => {
  const { followingId } = req.body;
  const user = await User.findOne({ _id: followingId });
  const follow = await Follow.findOne({
    following: followingId,
    follower: req.user._id,
  });
  await follow.remove();
  res
    .status(200)
    .json({ success: true, message: `You unfollowed ${user.name}` });
});

// get all my followers
exports.getMyFollowers = catchAsyncError(async (req, res, next) => {
  const follows = await Follow.find({ following: req.user._id }).populate(
    "follower"
  );
  res.status(200).json({ success: true, followersList: follows });
});

// get users whom I am following
exports.getMyFollowing = catchAsyncError(async (req, res, next) => {
  const follows = await Follow.find({ follower: req.user._id }).populate(
    "following"
  );
  res.status(200).json({ success: true, followingList: follows });
});
