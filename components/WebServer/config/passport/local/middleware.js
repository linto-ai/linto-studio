const debug = require('debug')('linto:conversation-manager:components:webserver:config:passport:local:middleware')

require('./local')
const passport = require('passport')

const { expressjwt: jwt } = require("express-jwt")
const jwtDecode = require('jwt-decode')

const UsersModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const { MalformedToken, MultipleUserFound, InvalidCredential, UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/auth`)

const refreshToken = require('./token/refresh')

module.exports = {
    authType: 'local',
    authenticate: (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user) => {
            if (err) {
                res.status(err.status).json({ error: err })
            } else if (!user) throw new InvalidCredential()
            else {
                res.status(200).json({
                    message: 'login success',
                    token: user.token.auth_token,
                    userId: user.token.session_id.toString()
                })
            }
        })(req, res, next)
    },
    authenticate_reset: (req, res, next) => {
        passport.authenticate('local_magic_link', { session: false }, (err, user) => {
            if (err) {
                res.status(err.status).json({ error: err })
            } else if (!user) throw new InvalidCredential()
            else {
                res.status(200).json({
                    message: 'login success',
                    token: user.token.auth_token,
                    userId: user.token.session_id.toString()
                })
            }
        })(req, res, next)
    },
    isAuthenticate: [
        jwt({
            secret: generateSecretFromHeaders,
            algorithms: ["HS256"],
            getToken: getTokenFromHeaders,
        }),
        (req, res, next) => {
            const tokenData = jwtDecode(req.headers.authorization.split(' ')[1])

            req.payload = {
                data: {
                    userId: tokenData.data.userId
                }
            }
            next()
        }
    ],
    refresh_token: [
        jwt({
            secret: generateRefreshSecretFromHeaders,
            algorithms: ["HS256"],
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

function getTokenFromHeaders(req) {
    const { headers: { authorization } } = req
    if (authorization && authorization.split(' ')[0] === 'Bearer') return authorization.split(' ')[1]
    else return null
}

async function generateSecretFromHeaders(req, token, done) {
    try {
        if (!token?.payload?.data) throw new MalformedToken()
        const { headers: { authorization } } = req
        const userId = token.payload.data.userId

        if (authorization.split(' ')[0] === 'Bearer') {
            const users = await UsersModel.getUserTokenById(userId)
            if (users.length === 0) throw new UserNotFound()
            else if (users.length !== 1) throw new MultipleUserFound()
            else return users[0].keyToken + process.env.CM_JWT_SECRET
        }

    } catch (error) {
        console.error('generateSecretFromHeaders ERR:')
        throw error
    }
}

async function generateRefreshSecretFromHeaders(req, payload, done) {
    try {
        if (!payload || !payload.data) done(new MalformedToken())

        const { headers: { authorization } } = req
        if (authorization.split(' ')[0] === 'Bearer') {
            const users = UsersModel.getUserTokenById(payload.data.userId)
            if (users.length === 0) done(new UserNotFound())
            else if (users.length !== 1) done(new MultipleUserFound())
            else done(null, users[0].keyToken + process.env.CM_REFRESH_SECRET)
        }
    } catch (error) {
        console.error('generateRefreshSecretFromHeaders ERR:')
        throw error
    }

}