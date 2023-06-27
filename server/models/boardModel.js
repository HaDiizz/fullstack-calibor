const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    icon: {
      type: String,
      default: '📋',
    },
    title: {
      type: String,
      default: 'Untitled',
    },
    description: {
      type: String,
      default: 'No Description...',
    },
    position: {
      type: Number,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    favoritePosition: {
      type: Number,
      default: 0,
    },
    participants: [
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

module.exports = mongoose.model('board', boardSchema);
