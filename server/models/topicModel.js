const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Types.ObjectId,
      ref: "scheduleGroup",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#FF5733",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("topic", topicSchema);
