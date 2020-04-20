const debug = require('debug')('app:router:api:user:users')
const {getUsers} = require(`${process.cwd()}/components/WebServer/routecontrollers/user/users.js`)



module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get', 
        requireAuth: false, 
        controller: getUsers
    }]
}