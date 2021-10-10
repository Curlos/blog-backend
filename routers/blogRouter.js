const express = require('express')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User, BlogPost, Comment } = require('../models/models')
const bcrypt = require("bcryptjs")
const router = express.Router()

router.get('/', async (req, res) => {
  const results = await BlogPost.find({})
  res.json(results)
})

router.post('/', async (req, res) => {
  const blogPost = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    headerImageURL: req.body.headerImageURL,
    likes: req.body.likes,
    comments: req.body.comments,
    author: req.body.author
  })

  const savedBlogPost = await blogPost.save()

  const user = await User.findOne({_id: req.body.author})
  user.blogPosts = [...user.blogPosts, savedBlogPost]
  await user.save()

  res.json(savedBlogPost)
})

router.post('/blog/comment', async (req, res) => {
  const comment = new Comment({
    text: req.body.text,
    likes: req.body.likes,
    comments: req.body.comments,
    author: req.body.author
  })

  const savedBlogPost = await blogPost.save()

  const user = await User.findOne({_id: req.body.author})
  user.blogPosts = [...user.blogPosts, savedBlogPost]
  await user.save()

  res.json(savedBlogPost)
})

router.get('/blog-post/:id', async (req, res) => {
  const blog = await BlogPost.find({_id: req.params.id})
  res.json(blog)
})

router.get('/comment/:id', async (req, res) => {
  const comment = await Comment.find({_id: req.params.id})
  res.json(comment)
})

router.post('/blog-post/comment', async (req, res) => {
  const comment = await new Comment({
    text: req.body.text,
    userID: req.body.userID,
    blogID: req.body.blogID,
    likes: req.body.likes,
    replies: req.body.replies
  })

  const user = await User.findOne({_id: req.body.userID})
  const blogPost = await BlogPost.findOne({_id: req.body.blogID})
  const savedComment = await comment.save()

  user.comments = [...user.comments, savedComment]
  blogPost.comments = [...blogPost.comments, savedComment]
  await user.save()
  await blogPost.save()

  res.json(savedComment)
})

router.put('/blog-post/comment/like', async (req, res) => {

  const comment = await Comment.findOne({_id: req.body.commentID})
  const user = await User.findOne({_id: req.body.userID})

  console.log(req.body)
  
  if (req.body.likedComment) {
    console.log('unliking comment')
    user.likedComments = user.likedComments.filter((commentID) => commentID != comment._id)
    comment.likes = comment.likes - 1
  } else {
    console.log('liking comment')
    comment.likes = comment.likes + 1
    user.likedComments = [...user.likedComments, comment]

    console.log(user.likedComments)


  }

  const updatedUser = await user.save()
  const updatedComment = await comment.save()
  res.json(updatedComment)
})

router.post('/comment/reply/:commentID', async (req, res) => {
  const comment = await Comment.findOne({_id: req.params.commentID})

  const reply = await new Comment({
    text: req.body.text,
    userID: req.body.userID,
    blogID: req.body.blogID,
    likes: req.body.likes,
    replies: req.body.replies,
    replyingTo: comment
  })

  const savedReply = await reply.save()

  comment.replies = [...comment.replies, savedReply]

  await comment.save()

  res.json(savedReply)
})

module.exports = router;
