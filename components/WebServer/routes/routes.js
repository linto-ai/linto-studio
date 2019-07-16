const debug = require('debug')('app:webserver:routes')

module.exports = (webServer) => {
    return {
        "/test": require('./test')(webServer)
    }
}