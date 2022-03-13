const catchAsyncError = require("../middlewares/catchAsyncError");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// create comment
exports.createComment = catchAsyncError(async (req, res, next) => {
  const { content, postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  const userComment = await Comment.findOne({
    post: postId,
    owner: req.user._id,
  });
  if (!userComment) {
    await Comment.create({ post: postId, owner: req.user._id, content });
    post.commentsCount++;
    await post.save();
    return res
      .status(201)
      .json({ success: true, message: "Your comment is posted" });
  } else {
    return res
      .status(200)
      .json({ success: false, message: "You already commented" });
  }
});

// delete comment
exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const comment = await Comment.findOne({
    post: req.body.postId,
    owner: req.user._id,
  });
  await comment.remove();
  res.status(200).json({ success: true, message: "Your comment is deleted" });
});

// get post's comments
exports.getPostComments = catchAsyncError(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId }).populate(
    "owner"
  );
  res.status(200).json({ success: true, comments });
});
