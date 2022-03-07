const mongoose = require("mongoose");

// schema for like
const likeSchema = new mongoose.Schema({
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
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// like model
module.exports = mongoose.model("Like", likeSchema);
