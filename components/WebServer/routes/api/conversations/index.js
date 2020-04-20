const debug = require('debug')('app:router:api:conversations')
const { getAllConversations} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversations/index.js`)

module.exports = (webserver) => {
    return [{
            path: '/',
            method: 'get',
            requireAuth: false,
            controller: getAllConversations
            }]
        }