const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/login": require('./api/login')(webServer),
        "/api/users": require('./api/users')(webServer),
        "/api/user": require('./api/user')(webServer)
    }
}