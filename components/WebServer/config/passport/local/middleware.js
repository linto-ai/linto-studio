const debug = require('debug')('linto:conversation-manager:components:webserver:config:auth:auth')

require('./local')
const passport = require('passport')
const jwt = require('express-jwt')

const UsersModel = require(`${process.cwd()}/lib/mongodb/models/users`)

const { MalformedToken, MultipleUserFound } = require(`${process.cwd()}/components/WebServer/error/exception/auth`)
const { UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/users`)


const refreshToken = require('./token/refresh')

module.exports = {
    authType: 'local',
    authenticate: (req, res, next) => {
        console.log('BODY middleWare', req.body)
        passport.authenticate('local', { session: false }, (err, user) => {
            console.log('Passeport user', user)
            if (err) {
                console.error(err)
                res.json({
                    error: err
                })
            } else {
                if (!!user && !!user.token) {
                    res.cookie('authToken', user.token.auth_token, {
                        expires: new Date(Date.now() + 900000)
                    })

                    res.cookie('userId', user.token.session_id.toString(), {
                        expires: new Date(Date.now() + 900000)
                    })
                    req.session.token = user.token
                    req.session.userId = user.token.session_id
                    req.session.logged = 1
                    req.session.save((err) => {
                        if (err) {
                            throw "Error on saving session"
                        }
                        res.json({
                            status: 200,
                            msg: 'login success',
                            code: 'ok',
                            token: user.token.auth_token
                        })
                    })
                } else {
                    req.session.token = ''
                    req.session.logged = 0
                    req.session.userId = ''
                    req.session.save((err) => {
                        if (err) {
                            throw "Error on saving session"
                        }
                        res.json({
                            status: 401,
                            msg: 'token not found',
                            code: 'error'
                        })
                    })
                }
            }
        })(req, res, next);
    },
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
        async(req, res, next) => {
            const { headers: { authorization } } = req
            let token = await refreshToken(authorization)
            res.local = token
            next()
        }
    ]
}

function getTokenFromHeaders(req, res, next) {
    const { headers: { authorization } } = req
    if (authorization && authorization.split(' ')[0] === 'Bearer') return authorization.split(' ')[1]
    else return null
}

function generateSecretFromHeaders(req, payload, done) {
    try {
        if (!payload || !payload.data) done(new MalformedToken())
        const { headers: { authorization } } = req

        if (authorization.split(' ')[0] === 'Bearer') {
            UsersModel.getUserTokenById(payload.data.userId).then(users => {
                if (users.length === 0) done(new UserNotFound())
                else if (users.length !== 1) done(new MultipleUserFound())
                else return done(null, users[0].keyToken + process.env.CM_JWT_SECRET)
            })
        }
    } catch (error) {
        console.error('generateSecretFromHeaders ERR:')
        done(error)
    }
}

function generateRefreshSecretFromHeaders(req, payload, done) {
    try {
        if (!payload || !payload.data) done(new MalformedToken())

        const { headers: { authorization } } = req
        if (authorization.split(' ')[0] === 'Bearer') {
            UsersModel.getUserTokenById(payload.data.userId).then(users => {
                if (users.length === 0) done(new UserNotFound())
                else if (users.length !== 1) done(new MultipleUserFound())
                else done(null, users[0].keyToken + process.env.CM_REFRESH_SECRET)
            })
        }
    } catch (error) {
        console.error('generateRefreshSecretFromHeaders ERR:')
        done(error)
    }

}