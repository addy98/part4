require('dotenv').config()

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('connected to blogList.blogs')
    })
    .catch(error => {
        console.log(`error connecting to blogList.blogs: ${error.message}`)
    })

// transform returned documents with configurable options in setter of schema
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)