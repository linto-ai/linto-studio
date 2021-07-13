const debug = require('debug')('app:webserver:middlewares')
const userModel = require(`${process.cwd()}/models/mongodb/models/users`)
const convosModel = require(`${process.cwd()}/models/mongodb/models/conversations`)

function isProduction() {
    return process.env.NODE_ENV === 'production'
}

function logger(req, res, next) {
    debug(`[${Date.now()}] new user entry on ${req.url}`)
    debug('body:', req.body)
        //debug('session :', req.session)
    next()
}

async function isConnected(req, res, next) {
    try {
        if (!!req.session) {
            //console.log(req.session)
            if (!!req.session.logged && !!req.session.token) {
                // Already logged  
                if (req.session.logged === 1) {
                    res.cookie('authToken', req.session.token.auth_token, {
                        expires: new Date(Date.now() + 900000)
                    })

                    res.cookie('userId', req.session.userId.toString(), {
                        expires: new Date(Date.now() + 900000)
                    })
                    if (req.url === '/login') {
                        res.redirect('/interface/conversations')
                    } else {
                        next()
                    }
                } else {
                    res.cookie('authToken', { expires: Date.now() })
                    res.cookie('userId', { expires: Date.now() })
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
            res.redirect('/login')
        }
    }
}

async function hasReadAccess(req, res, next) {
    try {
        if (!!req.params.convoId && !!req.session.userId) {
            const conversationId = req.params.convoId
            const userId = req.session.userId
            let convo = await convosModel.getConvoById(conversationId)
            if (convo.length > 0) {
                if (convo[0].owner === userId) {
                    next()
                } else if (convo[0].sharedWith.length > 0) {
                    let shared = false
                    for (let shareUser of convo[0].sharedWith) {
                        if (shareUser.user_id === userId) {
                            shared = true
                        }
                    }
                    if (shared) {
                        next()
                    } else {
                        throw { msg: 'Access denied' }
                    }
                } else {
                    throw { msg: 'Access denied' }
                }
            } else {
                throw { msg: 'Conversation not found' }
            }
        } else {
            throw { msg: 'Conversation Id not found' }
        }
    } catch (error) {
        console.error(error)
        res.json({ error })
    }

}

module.exports = {
    logger,
    isConnected,
    hasReadAccess
}