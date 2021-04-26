const debug = require('debug')('app:router:api:conversation:convos')
const { getAllConversations } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/convos.js`)

module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: true,
        controller: getAllConversations
    }]
}