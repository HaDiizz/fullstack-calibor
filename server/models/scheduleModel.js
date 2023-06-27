const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Types.ObjectId,
      ref: "scheduleGroup",
      required: true,
    },
    title: {
      type: String,
    },
    filename: {
      type: String,
    },
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    color: {
      type: String,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("schedule", scheduleSchema);
