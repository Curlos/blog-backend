const express = require('express')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { BlogPost } = require('../models/models')
const bcrypt = require("bcryptjs")
const router = express.Router()

router.get('/', async (req, res) => {
  const results = await BlogPost.find({})
  console.log(results)

  res.json(results)
})

router.get('')

module.exports = router;
