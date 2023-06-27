const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  section: {
    type: mongoose.Types.ObjectId,
    ref: 'section',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  position: {
    type: Number
  },
  assignTo: [{type: mongoose.Types.ObjectId, ref: 'user'}]
}, {
    timestamps: true,
  })

module.exports = mongoose.model('task', taskSchema)