const debug = require('debug')('app:webserver:middlewares')
const convosModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

function isProduction() {
    return process.env.NODE_ENV === 'production'
}

// Logs requests url, method and execution time
function logger(req, res, next) {
    // On request start
    debug(`${req.method} ${req.originalUrl} [STARTED]`, req.body)
    const start = process.hrtime()

    // On request finish
    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start)
        debug(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
    })

    // On request close
    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start)
        debug(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
    })
    next()
}

// Check if user is connected
async function isConnected(req, res, next) {
    try {
        if (!!req.session) {
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

module.exports = {
    logger,
    isConnected,
    isProduction
}