const debug = require('debug')('app:webserver:middlewares')
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const jwt = require('jsonwebtoken')
const auth_middlewares = require(`../config/passport/local/middleware`)

function isProduction() {
    return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
    debug(`[${Date.now()}] new user entry on ${req.url}`)
    console.log('url :', req.url)
    console.log('session :', req.session)
    next()
}

async function isConnected(req, res, next) {
    try {
        if (!!req.session) {
            if (!!req.session.logged && !!req.session.token) {
                // Already logged  
                if (req.session.logged === 1) {
                    if (req.url === '/login') {
                        res.redirect('/interface/conversations')
                    } else {
                        next()
                    }
                } else {
                    throw 'Session not found '
                }
            } else {
                throw 'Session token not found'
            }
        } else {
            throw 'Session not found'
        }
    } catch (error) {
        console.error(error)
        if (req.url === '/login') {
            next()
        } else {
            console.log('catch2')
            res.redirect('/login')
        }
    }
}

async function isOwner(req, res, next) {
    // isOwner will alway require ownerid as input 
    // (rather than getting it from session)
    if (isProduction()) {
        if (req && req.session) {
            const userid = req.session.userid
            try {
                const user = await userModel.getUserbyId(userid)
                const convos = user[0].convoAccess[req.body.convoId]
                if (convos === 'owner') {
                    //Pass!
                    next()
                } else {
                    throw ({
                        status: 'error',
                        msg: 'User does not have right to add users',
                        code: 'NotConvoOwner'
                    })
                }
            } catch (error) {
                res.json({
                    status: "error",
                    msg: error
                })
            }
        } else {
            res.redirect('/sessionNotFound')
        }
    } else {
        next()
    }
}

module.exports = {
    logger,
    isConnected,
    isOwner
}