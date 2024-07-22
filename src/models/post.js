const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please write a name']
    }
  },
  {
    timestamps: true
  }
)

const Posts = mongoose.model('Post', postSchema)

module.exports = Posts
