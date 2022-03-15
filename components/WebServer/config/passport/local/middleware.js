const debug = require('debug')('linto:conversation-manager:components:webserver:config:auth:auth')

require('./local')
const passport = require('passport')
const jwt = require('express-jwt')

const UsersModel = require(`${process.cwd()}/lib/mongodb/models/users`)
const ConversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const { MalformedToken, MultipleUserFound } = require(`${process.cwd()}/components/WebServer/error/exception/auth`)
const {
    ConversationOwnerAccessDenied,
    ConversationReadAccessDenied,
    ConversationWriteAccessDenied,
    ConversationNotShared,
    ConversationIdRequire
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const refreshToken = require('./token/refresh')
const RIGHTS = require(`${process.cwd()}/lib/dao/rights/conversation`)

module.exports = {
    authType: 'local',
    authenticate: (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user) => {
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
    asOwnerAccess: [
        (req, res, next) => {
            ConversationModel.getConvoOwner(req.params.conversationid).then(conversation => {
                if (conversation.length === 1 && conversation[0].owner === req.payload.data.userId) next()
                else next(new ConversationOwnerAccessDenied())
            })
        },
    ],
    asReadAccess: [(req, res, next) => {
        checkConvSharedRight(next, req.params.conversationid, req.payload.data.userId, RIGHTS.READ, ConversationReadAccessDenied)
    }],
    asWriteAccess: [(req, res, next) => {
        checkConvSharedRight(next, req.params.conversationid, req.payload.data.userId, RIGHTS.WRITE, ConversationWriteAccessDenied)
    }],
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
        if (!payload || !payload.data) {
            return new MalformedToken()
        } else {
            const { headers: { authorization } } = req
            if (authorization.split(' ')[0] === 'Bearer') {
                UsersModel.getUserTokenById(payload.data.userId).then(users => {
                    if (users.length === 1) return done(null, users[0].keyToken + process.env.CM_JWT_SECRET)
                    else throw MultipleUserFound
                })
            }
        }
    } catch (error) {
        console.error('generateSecretFromHeaders ERR:', error)
        return error
    }
}

function generateRefreshSecretFromHeaders(req, payload, done) {
    try {
        if (!payload || !payload.data) {
            throw new MalformedToken()
        } else {
            const { headers: { authorization } } = req
            if (authorization.split(' ')[0] === 'Bearer') {
                UsersModel.getUserTokenById(payload.data.userId).then(users => {
                    if (users.length === 1) done(null, users[0].keyToken + process.env.CM_REFRESH_SECRET)
                    else throw MultipleUserFound
                })
            }
        }
    } catch (error) {
        console.error('generateRefreshSecretFromHeaders ERR:', error)
        return error
    }

}

function checkConvSharedRight(next, conversationId, userId, right, rightException) {
    if (!conversationId) {
        next(new ConversationIdRequire())
        return
    }
    ConversationModel.getConvoShared(conversationId).then(conversation => {
        if (conversation.length === 1 && conversation[0].sharedWith) {
            if (conversation.length === 1 && conversation[0].owner === userId) next()
            else {
                let userFound = false
                conversation[0].sharedWith.map(conversationUsers => {
                    if (conversationUsers.user_id === userId)
                        if (RIGHTS.asRightAccess(conversationUsers.rights, right)) {
                            userFound = true
                            next()
                        } else next(new rightException())
                })
                if (!userFound) next(new ConversationNotShared())
            }
        } else next(new ConversationNotShared())
    })
}