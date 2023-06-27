const mongoose = require("mongoose");

const scheduleGroupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      type: String,
      trim: true,
      required: true,
      default:
        "https://res.cloudinary.com/dmgfhwjl6/image/upload/v1687584055/f6rn8ulcish44x_cbqiw8.png",
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "No Description...",
    },
    link: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("scheduleGroup", scheduleGroupSchema);
