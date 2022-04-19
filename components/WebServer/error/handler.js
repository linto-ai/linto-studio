const debug = require('debug')('linto:conversation-manager:components:WebServer:error:handler')

const AuthsException = require('./exception/auth')
const ServerException = require('./exception/server')
const UsersException = require('./exception/users')
const ConversationException = require('./exception/conversation')
const OrganizationException = require('./exception/organization')


const JWT_DEFAULT_EXCEPTION = 'UnauthorizedError' // Default JWT exception

let init = function(webserver) {
    //Handle controller exception has API output
    let customException = [JWT_DEFAULT_EXCEPTION]
    Object.keys(AuthsException).forEach(key => customException.push(key))
    Object.keys(ServerException).forEach(key => customException.push(key))
    Object.keys(UsersException).forEach(key => customException.push(key))
    Object.keys(ConversationException).forEach(key => customException.push(key))
    Object.keys(OrganizationException).forEach(key => customException.push(key))

    webserver.express.use(function(err, req, res, next) {
        if (err) console.error(err)

        if (customException.indexOf(err.name) > -1) {
            res.status(err.status).send({ message: err.message })
            return
        } else if (err) { // Handle unsupported exception
            res.status(500).send({ message: err.message })
            return
        }

        next()
    })

}

module.exports = {
    init
}