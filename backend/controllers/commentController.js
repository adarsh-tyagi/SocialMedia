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
    const allComments = await Comment.find({ post: req.body.postId }).populate(
      "owner"
    );
    return res
      .status(201)
      .json({ success: true, message: "Your comment is posted", allComments, postId });
  } else {
    const allComments = await Comment.find({ post: req.body.postId }).populate(
      "owner"
    );
    return res
      .status(200)
      .json({ success: false, message: "You already commented", allComments, postId });
  }
});

// delete comment
exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.postId });
  const comment = await Comment.findOne({
    post: req.params.postId,
    owner: req.user._id,
  });
  await comment.remove();
  post.commentsCount--;
  await post.save();
  const allComments = await Comment.find({ post: req.params.postId }).populate(
    "owner"
  );
  res
    .status(200)
    .json({ success: true, message: "Your comment is deleted", allComments, postId: req.params.postId });
});

// get post's comments
exports.getPostComments = catchAsyncError(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId }).populate(
    "owner"
  );
  res.status(200).json({ success: true, comments });
});
