const session = require("express-session")

const sessionMiddleware = session({
  secret: process.env.WEBSERVER_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // true if HTTPS
})

module.exports = { sessionMiddleware }
