const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/login": require('./login')(webServer),
        "/api/users": require('./api/users/users')(webServer), 
        "/api/conversations": require('./api/conversation/convos')(webServer), 
        "/api/conversation": require('./api/conversation/convo')(webServer)
    }
}