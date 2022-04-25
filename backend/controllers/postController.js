const Post = require("../models/postModel");
const User = require("../models/userModel");
const Follow = require("../models/followModel");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");
const cloudinary = require("cloudinary");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

// get home feed posts
exports.getHomePosts = catchAsyncError(async (req, res, next) => {
  const postPerPage =5;
  const page = req.query.page;
  const homePosts = await Post.find()
    .sort({ created_at: -1 })
    .limit(postPerPage)
    .skip(postPerPage * (page - 1))
    .populate("owner");

  res.status(200).json({
    success: true,
    homePosts,
    numOfPosts: homePosts.length,
    postPerPage,
  });
});

// create a post
exports.createPost = catchAsyncError(async (req, res, next) => {
  const { caption, image } = req.body;
  if (!caption || !image) {
    return next(
      new ErrorHandler("Please fill the required fields for post", 400)
    );
  }
  const myCloud = await cloudinary.v2.uploader.upload(image, {
    folder: "SocialMedia-Posts",
  });
  const post = await Post.create({
    owner: req.user._id,
    caption,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    // image: {
    //   public_id: "postId",
    //   url: "post_url",
    // },
  });

  res.status(201).json({
    success: true,
    post,
    message: "You created new post successfully",
  });
});

// delete post
exports.deletePost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.params.postId,
    owner: req.user._id,
  });
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  await cloudinary.v2.uploader.destroy(post.image.public_id);
  // delete all likes and comments
  await Like.deleteMany({ post: post._id });
  await Comment.deleteMany({ post: post._id });
  await post.remove();
  res.status(200).json({ success: true, message: "Post deleted successfully" });
});

// get a post
exports.getPostDetails = catchAsyncError(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.postId }).populate("owner");
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  res.status(200).json({ success: true, post });
});

// get user's posts
exports.getUserPost = catchAsyncError(async (req, res, next) => {
  const posts = await Post.find({ owner: req.params.userId }).populate("owner").sort({created_at: -1});
  const userDetail = await User.findOne({ _id: req.params.userId });
  const followers = await Follow.find({ following: req.params.userId });
  const followings = await Follow.find({ follower: req.params.userId });
  res
    .status(200)
    .json({ success: true, posts, userDetail, followers, followings });
});

// get own posts
exports.getOwnPosts = catchAsyncError(async (req, res, next) => {
  const posts = await Post.find({ owner: req.user._id })
    .populate("owner")
    .sort({ created_at: -1 });
  res.status(200).json({ success: true, posts });
});
