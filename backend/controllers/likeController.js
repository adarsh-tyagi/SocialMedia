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

    const allLikes = await Like.find({ post: postId }).populate("owner");
    return res
      .status(200)
      .json({ success: true, message: "You liked the post", allLikes, postId });
  } else {
    post.likesCount--;

    await post.save();

    await like.remove();
    const allLikes = await Like.find({ post: postId }).populate("owner");
    return res.status(200).json({
      success: true,
      message: "Your like is removed",
      allLikes,
      postId,
    });
  }
});

// get post likes
exports.getPostLikes = catchAsyncError(async (req, res, next) => {
  const likes = await Like.find({ post: req.params.postId }).populate("owner");
  res.status(200).json({ success: true, likes, postId: req.params.postId });
});

// get user likes
exports.getUserLikes = catchAsyncError(async (req, res, next) => {
  const likedPosts = await Like.find({ owner: req.user._id })
    .populate("post")
    .populate("owner");
  res.status(200).json({ success: true, likedPosts });
});
