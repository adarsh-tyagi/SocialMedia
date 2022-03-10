const User = require("../models/userModel");
const cloudinary = require("cloudinary");
const sendMail = require("../utils/sendMail");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, bio, avatar } = req.body;
  if (!name || !email || !password || !bio || !avatar) {
    return next(new ErrorHandler("Please enter all the required fields", 400));
  }
  //   const myCloud = await cloudinary.v2.uploader.upload(avatar, {
  //     folder: "SocialMedia-Avatars",
  //   });
  const user = await User.create({
    name,
    email,
    password,
    bio,
    avatar: {
      public_id: "public_id",
      url: "url",
    },
    // avatar: {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
    // },
  });
  const token = user.getJWTToken();
  try {
    const message = `Hi ${name},\nWelcome to Social Media App. You are now successfully registered to the app.\n\nSocialMedia Team`;
    await sendMail({
      email,
      subject: "Welcome to SocialMedia",
      message,
    });
  } catch (error) {
    console.log("Email is not sent to the user. Something went wrong");
  }
  res.status(201).json({
    success: true,
    user,
    token,
    message: "You are registered successfully",
  });
});

// login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all required fields", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found for this email", 404));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Credentials", 400));
  }
  const token = user.getJWTToken();
  res
    .status(200)
    .json({ success: true, user, token, message: "You are logged in" });
});

// get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("Please login to access the resource", 400));
  }
  res.status(200).json({ success: true, user });
});

// logout user
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ success: true, message: "You are logged out" });
});

// update user profile
exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    bio: req.body.bio,
  };
  if (req.body.avatar && req.body.avatar !== "") {
    const user = await User.findById(req.user._id);
    const avatar_public_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(avatar_public_id);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "SocialMedia-Avatars",
    });
    userData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user._id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "User Profile Updated Successfully",
  });
});

// delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("Please login to access the resource", 400));
  }
  const avatar_public_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(avatar_public_id);
  await user.remove();
  res
    .status(200)
    .json({ success: true, message: "User Account Deleted Successfully" });
});

// forgot user password
exports.forgotUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found for this email", 400));
  }
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`
  const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`;

  const message = `Hi ${user.name}\nPlease click on the url to change your password\n${resetPasswordUrl}\nIf you did not requested for the same. Kindly ignore the mail\n\nSocialMedia Team`;
  try {
    sendMail({
      email: req.body.email,
      subject: "Social Media - Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Password Reset Email sent successfully",
    });
  } catch (error) {
    console.log("Email is not sent. Something went wrong");
    user.resetPassworsToken = undefined;
    user.resetPassworsExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Email not sent. Somthing went wrong", 500));
  }
});

// reset user password
exports.resetUserPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPassworsExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Reset Password Token Expired", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPassworsExpire = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Changed Successfully. Please Login",
  });
});

// get other user details
exports.getOtherUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.find({ id: req.params.userId });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, otherUser: user });
});

// search users
exports.searchUsers = catchAsyncError(async (req, res, next) => {
  const regex = new RegExp(req.query.search, "ig");
  const searchResults = await User.find({ name: regex }).limit(10);
  res.status(200).json({ success: true, searchResults });
});
