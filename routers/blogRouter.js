const express = require('express')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User, BlogPost } = require('../models/models')
const bcrypt = require("bcryptjs")
const router = express.Router()

router.get('/', async (req, res) => {
  const results = await BlogPost.find({})
  console.log(results)

  res.json(results)
})

router.post('/', async (req, res) => {
  const blogPost = new BlogPost({
    title: req.body.title,
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

router.get('')

module.exports = router;
