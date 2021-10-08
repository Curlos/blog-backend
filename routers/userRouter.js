const express = require('express')
const passport = require("passport");
const { User, BlogPost } = require('../models/models')
const bcrypt = require("bcryptjs")
const router = express.Router()

router.get('/', (req, res) => {
  console.log(req.user)
  res.json(req.user)
})

router.get("/logout", (req, res) => {
  console.log('Logging out user')
  const user = req.user
  req.logout();
  res.json({...user})
});

router.post("/register", async (req, res, next) => {
  const newUsername = req.body.username
  const newPassword = req.body.password

  const userFound = await User.find({lowerCaseUsername: newUsername.toLowerCase().trim()})

  if (userFound.length > 0) {
    return res.json({error: 'Username taken'})
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return err
    }

    const user = new User({
      fullName: req.body.fullName,
      username: req.body.username,
      password: hashedPassword,
      comments: [],
      likedBlogs: [],
      lowerCaseUsername: req.body.username.toLowerCase(),
      icon: req.body.icon
    }).save((err, result) => {
      if (err) { 
        return next(err);
      }
      console.log('no err')
      res.json({'result': result})
    });
  })
});

router.post("/login", (req, res, next) => {

  console.log(req.body)
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json({user: req.user});
        console.log(req.user);
      });
    }
  })(req, res, next);
});

router.get('/user/:id', async (req, res) => {

  const user = await User.findOne({_id: req.params.id})

  if (!user) {
    return res.send('User not found')
  }

  return res.json(user)
})

router.get('/user/blogs/:id', async (req, res) => {

  const user = await User.findOne({_id: req.params.id})

  if (!user) {
    res.json({error: 'User not found'})
  }

  const userBlogPosts = []

  for (let blogPostID of user.blogPosts) {
    const blogPost = await BlogPost.findById(blogPostID)
    userBlogPosts.push(blogPost)
  }

  res.json(userBlogPosts)
})

module.exports = router;