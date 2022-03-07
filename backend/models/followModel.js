const mongoose = require("mongoose");

// schema for followers anbd following
const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "follower user not specified"],
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "following user not specified"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// follow model
module.exports = mongoose.model("Follow", followSchema);
