const mongoose = require("mongoose");

// schema for post
const postSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User not specified"],
  },
  caption: {
    type: String,
    required: [true, "Please enter post caption"],
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// post model
module.exports = mongoose.model("Post", postSchema);
