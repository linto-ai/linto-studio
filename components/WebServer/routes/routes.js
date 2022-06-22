const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./root')(webServer),
        "/auth": require('./auth')(webServer),
        "/api/users": require('./api/users/users.js')(webServer),
        "/api/organizations": require('./api/organization/organizations')(webServer),
        "/api/conversations": require('./api/conversation/conversations')(webServer),
        "/api/services": require('./api/service/services')(webServer)
    }
}