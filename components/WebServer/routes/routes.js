const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./root')(webServer),
        "/healthcheck": require('./api/healthcheck/healthcheck')(webServer),
        "/auth": require('./auth')(webServer),
        "/api/users": require('./api/users/users.js')(webServer),
        "/api/organizations": require('./api/organization/organizations')(webServer),
        "/api/conversations": require('./api/conversation/conversations')(webServer),
        "/api/nlp": require('./api/nlp/keyword')(webServer),
        "/api/services": require('./api/service/services')(webServer),
        "/api": require('./api/media/media')(webServer)
    }
}