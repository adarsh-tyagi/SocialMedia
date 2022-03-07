const mongoose = require("mongoose");

// schema for notification
const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender user not specified"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver user not specified"],
  },
  content: {
    type: String,
    required: [true, "Notification content not specified"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// notification model
module.exports = mongoose.model("Notification", notificationSchema);
