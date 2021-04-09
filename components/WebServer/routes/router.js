const debug = require('debug')(`linto:conversation-manager:components:WebServer:routes:router`)
const path = require('path')
const middlewares = require(path.join(__dirname, "../middlewares"))

const auth_middlewares = require(`../config/passport/local/middleware`)

const ifHasElse = (condition, ifHas, otherwise) => {
    return !condition ? otherwise() : ifHas()
}

class Router {
    constructor(webServer) {
        const routes = require('./routes.js')(webServer, auth_middlewares)

        for (let level in routes) {
            for (let path in routes[level]) {
                const route = routes[level][path]
                const method = route.method
                if (route.requireAuth) {
                    debug('Create route : ' + route.method + ' - ' + level + route.path)
                    webServer.express[method](
                        level + route.path,
                        middlewares.logger,
                        auth_middlewares.isAuthenticate,
                        ifHasElse(
                            Array.isArray(route.controller),
                            () => Object.values(route.controller),
                            () => route.controller
                        )
                    )
                } else {
                    webServer.express[method](
                        level + route.path,
                        middlewares.logger,
                        ifHasElse(
                            Array.isArray(route.controller),
                            () => Object.values(route.controller),
                            () => route.controller
                        )
                    )
                }
            }
        }
    }
}


module.exports = webServer => new Router(webServer)