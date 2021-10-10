const mongoose = require('mongoose')
const Schema = mongoose.Schema

const day = new Date()
const timestamp = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate().toString().length === 2 ? day.getDate() : '0' + day.getDate()}, ${day.getHours().toString().length === 2 ? day.getHours() : '0' + day.getHours()}:${day.getMinutes().toString().length === 2 ? day.getMinutes() : '0' + day.getMinutes()}`

const userSchema = new Schema(
  {
    fullName: {type: String},
    username: {type: String, required: true},
    password: {type: String, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    likedComments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    blogPosts: [{type: Schema.Types.ObjectId, ref: 'BlogPost'}],
    likedBlogs: [{type: Schema.Types.ObjectId, ref: 'BlogPost'}],
    icon: {type: String},
    lowerCaseUsername: {type: String, lowercase: true, trim: true}
  }
)

const blogPostSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    content: {type: String},
    headerImageURL: {type: String},
    timestamp: {type: String, default: timestamp},
    likes: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: 'BlogPost'}],
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
  }
)

const commentSchema = new mongoose.Schema(
  {
    text: {type: String},
    timestamp: {type: String, default: timestamp},
    userID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    blogID: {type: Schema.Types.ObjectId, ref: 'BlogPost'},
    likes: {type: Number, default: 0},
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    replyingTo: {type: Schema.Types.ObjectId, ref: 'Comment'}
  }
)

const User = mongoose.model('User', userSchema)
const BlogPost = mongoose.model('BlogPost', blogPostSchema)
const Comment = mongoose.model('Comment', commentSchema)

module.exports = {User, BlogPost, Comment};