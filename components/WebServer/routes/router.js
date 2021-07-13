const debug = require('debug')(`linto:conversation-manager:components:WebServer:routes:router`)
const path = require('path')
const middlewares = require(path.join(__dirname, "../middlewares"))

const auth_middlewares = require(`../config/passport/local/middleware`)
const nav_middlewares = require(`${process.cwd()}/components/WebServer/middlewares/index.js`)
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
                if (process.env.DEV_DISABLE_AUTH === 'true') {
                    route.requireAuth = false
                    route.requireSession = false
                    route.requireOwnerAccess = false
                    route.requireReadAccess = false
                    route.requireWriteAccess = false
                    route.requireFrontReadAccess = false
                }
                if (process.env.LOGGER_ENABLED === true) {
                    middlewaresLoaded.push(nav_middlewares.logger)
                }
                //debug('Create route : ' + route.method + ' - ' + level + route.path)
                let middlewaresLoaded = []
                    // require passport auth (headers)
                if (route.requireAuth) middlewaresLoaded.push(auth_middlewares.isAuthenticate)
                    // require user session (authenticated)
                if (route.requireSession) middlewaresLoaded.push(nav_middlewares.isConnected)
                    // require owner access
                if (route.requireOwnerAccess) middlewaresLoaded.push(auth_middlewares.asOwnerAccess)
                    // require read access
                if (route.requireReadAccess) middlewaresLoaded.push(auth_middlewares.asReadAccess)
                    // require wirte access
                if (route.requireWriteAccess) middlewaresLoaded.push(auth_middlewares.asWriteAccess)

                if (route.requireFrontReadAccess) middlewaresLoaded.push(nav_middlewares.hasReadAccess)
                webServer.express[method](
                    level + route.path,
                    middlewares.logger,
                    middlewaresLoaded,
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


module.exports = webServer => new Router(webServer)