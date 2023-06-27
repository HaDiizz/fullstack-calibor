const mongoose = require('mongoose')

const sectionSchema = new mongoose.Schema({
  board: {
    type: mongoose.Types.ObjectId,
    ref: 'board',
    required: true
  },
  title: {
    type: String,
    default: ''
  }
}, {
    timestamps: true,
})

module.exports = mongoose.model('section', sectionSchema)