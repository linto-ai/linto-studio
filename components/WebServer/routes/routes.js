const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./root')(webServer),
        "/auth": require('./auth')(webServer),
        "/interface": require('./interface')(webServer),
        "/login": require('./login')(webServer),
        "/create-account": require('./createaccount')(webServer),
        "/api/users": require('./api/users/users')(webServer),
        "/api/organizations": require('./api/organizations/organizations')(webServer),
        "/api/conversations": require('./api/conversation/conversations')(webServer),

        // "/api/old_conversations": require('./api/conversation/convos')(webServer),
        // "/api/old_conversation": require('./api/conversation/convo')(webServer)
    }
}