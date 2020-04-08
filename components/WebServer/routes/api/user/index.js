const debug = require('debug')('app:router:api:user')
const {createUser, getUserbyId, deleteUser} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/index.js`)



module.exports = (webserver) => {
    return [{
        path: '/', 
        method: 'post', 
        requireAuth: false, 
        controller: createUser

    },
    {
        path: '/:userid',
        method: 'get', 
        requireAuth: false, 
        controller: getUserbyId
    },
    {
        path: '/:userid', 
        method: 'delete', 
        requireAuth: false, 
        controller: deleteUser
    }]
}