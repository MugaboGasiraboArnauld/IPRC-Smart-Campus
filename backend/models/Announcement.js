const mongoose = require("mongoose");

const annSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    target: String,
    priority: String,
    campus: String,
  },
  {
    timestamps: true,
  },
);

const Announcement = mongoose.model("Announcement", annSchema);

module.exports = Announcement;
