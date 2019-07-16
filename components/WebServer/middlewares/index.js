const debug = require('debug')('app:webserver:middlewares')


function logger(req, res, next) {
    debug(`[${Date.now()}] new user entry on ${req.url}`)
    next()
}

function checkAuth(req, res, next) {
    // gotta check session here
    next()

}
module.exports = {
    checkAuth,
    logger
}