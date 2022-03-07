const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Post = require("./postModel");
const Like = require("./likeModel");
const Comment = require("./commentModel");
const Notification = require("./notificationModel");
const Follow = require("./followModel");
const cloudinary = require("cloudinary");

// schema for user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    trim: true,
    minlength: [3, "Name can not be less than 3 characters"],
    maxlength: [20, "Name can not be greater than 20 characters"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    validate: [validator.isEmail, "Please enter valid email"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [5, "Password can not be less than 5 characters"],
    maxlength: [20, "Password can not be greater than 20 characters"],
    trim: true,
    select: false,
  },
  bio: {
    type: String,
    required: [true, "Please enter your bio"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// generating json token
userSchema.methods.getJWTToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  return token;
};

// generating reset password token
userSchema.methods.getResetPasswordToken = async function () {
  const user = this;
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();
  return resetToken;
};

// action before saving user
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  user.password = await bcrypt.hash(user.password, 10);
});

// action bedfore removing the user
userSchema.pre("remove", async function (next) {
  const user = this;

  // remove all likes documents
  const all_likes = await Like.find({ owner: user._id });
  for (let like of all_likes) {
    const post = await Post.findOne({ _id: like.post });
    post.likesCount--;
    await post.save();
  }
  await Like.deleteMany({ owner: user._id });

  // remove all comment documents
  const all_comments = await Comment.find({ owner: user._id });
  for (let comment of all_comments) {
    const post = await Post.findOne({ _id: comment.post });
    post.commentsCount--;
    await post.save();
  }
  await Comment.deleteMany({ owner: user._id });

  // remove all notification documents
  await Notification.deleteMany({
    $or: [{ sender: user._id }, { receiver: user._id }],
  });

  // remove all follow documents
  await Follow.deleteMany({
    $or: [{ follower: user._id }, { following: user._id }],
  });

  // remove all post documents
  const all_posts = await Post.find({ owner: user._id });
  for (let post of all_posts) {
    const public_id = post.image.public_id;
    await cloudinary.v2.uploader.destroy(public_id);
  }
  await Post.deleteMany({ owner: user._id });

  next();
});

// user model
module.exports = mongoose.model("User", userSchema);
