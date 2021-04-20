const debug = require('debug')('app:webserver:routes')

module.exports = (webServer, auth_middleware) => {
    return {
        "/": require('./root')(webServer, auth_middleware),
        "/auth": require('./auth')(webServer, auth_middleware),
        "/interface": require('./interface')(webServer),
        "/login": require('./login')(webServer),
        "/create-account": require('./createaccount')(webServer),
        "/api/users": require('./api/users/users')(webServer),
        "/api/conversations": require('./api/conversation/convos')(webServer),
        "/api/conversation": require('./api/conversation/convo')(webServer)
    }
}