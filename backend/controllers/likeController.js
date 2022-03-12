const catchAsyncError = require("../middlewares/catchAsyncError");
const Like = require("../models/likeModel");
const Post = require("../models/postModel");

// toogle like
exports.toggleLike = catchAsyncError(async (req, res, next) => {
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  const like = await Like.findOne({ post: postId, owner: req.user._id });
  if (!like) {
    await Like.create({ post: postId, owner: req.user._id });
    post.likesCount++;
    await post.save();
    return res
      .status(200)
      .json({ success: true, message: "You liked the post" });
  } else {
    post.likesCount--;
    await post.save();
    await like.remove();
    return res
      .status(200)
      .json({ success: true, message: "Your like is removed" });
  }
});

// get post likes
exports.getPostLikes = catchAsyncError(async (req, res, next) => {
  const likes = await Like.find({ post: req.params.postId }).populate("owner");
  res.status(200).json({ success: true, likes });
});

// get user likes
exports.getUserLikes = catchAsyncError(async (req, res, next) => {
  const likedPosts = await Like.find({ owner: req.user._id }).populate("post");
  res.status(200).json({ success: true, likedPosts });
});
