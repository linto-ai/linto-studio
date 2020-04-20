const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/login": require('./login')(webServer),
        "/api/users": require('./api/users')(webServer),
        "/api/user": require('./api/user')(webServer), 
        "/api/conversations": require('./api/conversations')(webServer), 
        "/api/conversation": require('./api/conversation')(webServer)
    }
}