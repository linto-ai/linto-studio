const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/api" : require('./api')(webServer),
        "/login" : require('./login')(webServer), 
        "/users" : require('./users')(webServer),
        "/user" : require('./users/user')(webServer),
        "/user/:userid" : require('./users/user')(webServer)
    }
}