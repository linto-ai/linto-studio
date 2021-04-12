const debug = require('debug')('linto:conversation-manager:components:webserver:config:auth:auth')

require('./local')
const passport = require('passport')
const jwt = require('express-jwt')

const UsersModel = require(`${process.cwd()}/models/mongodb/models/users`)

const { MalformedToken, MultipleUserFound } = require(`${process.cwd()}/components/WebServer/error/exception/auth`)
const refreshToken = require('./token/refresh')

module.exports = {
  authType: 'local',
  authenticate: passport.authenticate('local', { session: false }),
  isAuthenticate: [
    jwt({
      secret: generateSecretFromHeaders,
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
    }),
    (req, res, next) => {
      next()
    }
  ],
  refresh_token: [
    jwt({
      secret: generateRefreshSecretFromHeaders,
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
    }),
    async (req, res, next) => {
      const { headers: { authorization } } = req
      let token = await refreshToken(authorization)
      res.local = token
      next()
    }
  ]
}

function getTokenFromHeaders(req, res, next) {
  const { headers: { authorization } } = req
  if (authorization && authorization.split(' ')[1] === 'Bearer') return authorization.split(' ')[0]
  else return null
}

function generateSecretFromHeaders(req, payload, done) {
  if (!payload || !payload.data) {
    return done(new MalformedToken())
  } else {
    const { headers: { authorization } } = req
    if (authorization.split(' ')[1] === 'Bearer') {
      UsersModel.getUserByEmail(payload.data.email).then(users => {
          if (users.length === 1) return done(null, users[0].keyToken + process.env.LINTO_STACK_CM_JWT_SECRET)
          else throw MultipleUserFound
        })
    }
  }
}

function generateRefreshSecretFromHeaders(req, payload, done) {
  if (!payload || !payload.data) {
    done(new MalformedToken())
  } else {
    const { headers: { authorization } } = req
    if (authorization.split(' ')[1] === 'Bearer') {
      UsersModel.getUserByEmail(payload.data.email).then(users => {
          if (users.length === 1) done(null, users[0].keyToken + process.env.LINTO_STACK_OVERWATCH_REFRESH_SECRET)
          else throw MultipleUserFound
        })
    }
  }
}