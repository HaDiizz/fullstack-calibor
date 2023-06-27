const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dwiylz9ql/image/upload/v1655065923/nextjs_nextgen/niiedlgtd30vfhslacmw.jpg",
    },
    role: {
      type: String,
      default: "user",
    },
    resetLink: {
        type: String,
        default: ''
    },
    lineToken: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);