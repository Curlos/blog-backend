const express = require('express')
const dotenv = require('dotenv').config()
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const PORT = process.env.PORT || 8888
const blogRouter = require('./routers/blogRouter')
const userRouter = require('./routers/userRouter')
const database = require('./database/connection')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(cookieParser("cats"));
app.use(passport.initialize());
app.use(passport.session());
require('./passport/config')(passport)

app.use('/blogs', blogRouter)
app.use('/users', userRouter)

app.listen(PORT, () => {
  database.connectToServer((err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log(`Server is listening on port ${PORT}`)
})