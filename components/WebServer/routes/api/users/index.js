const debug = require('debug')('app:router:api:users')
const {getUsers} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/index.js`)



module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get', 
        requireAuth: false, 
        controller: getUsers
    }]
}