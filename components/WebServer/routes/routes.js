const debug = require('debug')('linto:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./root')(webServer),
        "/healthcheck": require('./api/healthcheck/healthcheck')(webServer),
        "/auth": require('./auth')(webServer),
        "/api/users": require('./api/users/users.js')(webServer),
        "/api/organizations": require('./api/organization/organizations')(webServer),
        "/api/conversations": [
            ...require('./api/conversation/transcribe')(webServer),
            ...require('./api/conversation/conversations')(webServer),
            ...require('./api/conversation/turn')(webServer),
        ],
        "/api/nlp": require('./api/nlp/keyword')(webServer),
        "/api/services": require('./api/service/services')(webServer, this),
        "/api": require('./api/media/media')(webServer)
    }
}