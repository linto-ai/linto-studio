const debug = require('debug')('linto:app:webserver:router')

const auth_middlewares = require(`../config/passport/local/middleware`)
const conversation_middlewares = require(`${process.cwd()}/components/WebServer/middlewares/access/conversation.js`)
const organization_middlewares = require(`${process.cwd()}/components/WebServer/middlewares/access/organization.js`)
const user_middlewares = require(`${process.cwd()}/components/WebServer/middlewares/access/user.js`)

const ifHasElse = (condition, ifHas, otherwise) => {
    return !condition ? otherwise() : ifHas()
}
class Router {
    constructor(webServer) {
        const routes = require('./routes.js')(webServer)
        for (let level in routes) {
            for (let path in routes[level]) {
                const route = routes[level][path]
                const method = route.method
                if (process.env.DEV_DISABLE_AUTH === 'true') {
                    route.requireAuth = false
                    route.requireSession = false
                    route.requireConversationOwnerAccess = false
                    route.requireConversationReadAccess = false
                    route.requireConversationWriteAccess = false
                    route.requireOrganizationOwnerAccess = false
                    route.requireOrganizationAdminAccess = false
                    route.requireOrganizationMaintainerAccess = false
                    route.requireOrganizationMemberAccess = false
                    route.requireOrganizationGuestAccess = false
                    route.requireUserVisibility = false
                }

                //debug('Create route : ' + route.method + ' - ' + level + route.path)
                let middlewaresLoaded = []
                // require passport auth (headers)
                if (route.requireAuth) middlewaresLoaded.push(auth_middlewares.isAuthenticate)

                // Conversation rights
                if (route.requireConversationOwnerAccess) middlewaresLoaded.push(conversation_middlewares.asOwnerAccess) // require owner access
                if (route.requireConversationReadAccess) middlewaresLoaded.push(conversation_middlewares.asReadAccess) // require read access
                if (route.requireConversationCommentAccess) middlewaresLoaded.push(conversation_middlewares.asCommentAccess) // require comment access
                if (route.requireConversationWriteAccess) middlewaresLoaded.push(conversation_middlewares.asWriteAccess) // require write access
                if (route.requireConversationDeleteAccess) middlewaresLoaded.push(conversation_middlewares.asDeleteAccess) // require delete access
                if (route.requireConversationShareAccess) middlewaresLoaded.push(conversation_middlewares.asShareAccess) // require delete access

                // Organization rights
                if (route.requireOrganizationOwnerAccess) middlewaresLoaded.push(organization_middlewares.asOwnerAccess)
                if (route.requireOrganizationAdminAccess) middlewaresLoaded.push(organization_middlewares.asAdminAccess)
                if (route.requireOrganizationMaintainerAccess) middlewaresLoaded.push(organization_middlewares.asMaintainerAccess)
                if (route.requireOrganizationMemberAccess) middlewaresLoaded.push(organization_middlewares.asMemberAccess)

                // User visibility
                if(route.requireUserVisibility) middlewaresLoaded.push(user_middlewares.isVisibility)

                if (process.env.LOGGER_ENABLED === "true") middlewaresLoaded.push(nav_middlewares.logger)

                webServer.express[method](
                    level + route.path,
                    middlewaresLoaded,
                    (req, res, next) => {
                        next();
                    },
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