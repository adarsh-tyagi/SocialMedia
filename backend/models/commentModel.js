const mongoose = require("mongoose");

// schema for comment
const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post id not specified"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User not specified"],
  },
  content: {
    type: String,
    required: [true, "Please enter the comment"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// comment model
module.exports = mongoose.model("Comment", commentSchema);
