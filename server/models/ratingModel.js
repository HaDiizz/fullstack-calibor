const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    value: { type: Number, required: true },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rate", rateSchema);
