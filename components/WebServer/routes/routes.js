const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/login" : require('./api/login')(webServer),
        "/users" : require('./api/users')(webServer), 
        "/user"  : require('./api/user')(webServer)
    }
}