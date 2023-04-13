const debug = require('debug')('linto:webserver:routes')

module.exports = (webServer) => {
    return {
        "/": require('./root')(webServer),
        "/healthcheck": require('./api/healthcheck/healthcheck')(webServer),
        "/auth": require('./auth')(webServer),
        "/api/users/favorites": require('./api/users/favorites.js')(webServer),
        "/api/users": require('./api/users/users.js')(webServer),
        "/api/organizations": require('./api/organization/organizations')(webServer),
        "/api/organizations/:organizationId/categories": require('./api/organization/categories')(webServer),
        "/api/organizations/:organizationId/tags": require('./api/organization/tag')(webServer),
        "/api/conversations": [
            ...require('./api/conversation/generate')(webServer),
            ...require('./api/conversation/conversations')(webServer),
            ...require('./api/conversation/share')(webServer),
            ...require('./api/conversation/turn')(webServer),
            ...require('./api/conversation/tag')(webServer),
        ],
        "/api/nlp": require('./api/nlp/keyword')(webServer),
        "/api/services": require('./api/service/services')(webServer, this),
        "/api": require('./api/media/media')(webServer),
    }
}