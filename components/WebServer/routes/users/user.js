const debug = require('debug')('app:router:api')
//const controller = require(path.join(__dirname, "../controllers/users"))
//const model = require(`${process.cwd()}/models/mongodb/models/users`)

const {getUserbyId, deleteUser, createUser} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/index.js`)



module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get', 
        requireAuth: false, 
        controller: getUserbyId
    }, 
    {
        path: '/', 
        method: 'delete', 
        requireAuth: false, 
        controller: deleteUser
    }, 
    {
        path: '/', 
        method: 'post', 
        requireAuth: false,
        controller: createUser
    }]
}