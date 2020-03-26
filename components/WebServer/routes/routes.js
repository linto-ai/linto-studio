const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/api" : require('./api')(webServer),
        "/login" : require('./login')(webServer)
    }
}