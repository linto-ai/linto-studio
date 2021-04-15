const debug = require('debug')('app:webserver:routes')

module.exports = (webServer, auth_middleware) => {
    return {
        "/auth": require('./auth')(webServer, auth_middleware),
        "/interface": require('./interface')(webServer),
        "/api/users": require('./api/users/users')(webServer),
        "/api/conversations": require('./api/conversation/convos')(webServer),
        "/api/conversation": require('./api/conversation/convo')(webServer)
    }
}