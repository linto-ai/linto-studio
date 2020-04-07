const debug = require('debug')('app:router:api')
//const controller = require(path.join(__dirname, "../controllers/users"))
//const model = require(`${process.cwd()}/models/mongodb/models/users`)

const {getUsers} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/index.js`)



module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get', 
        requireAuth: false, 
        controller: getUsers
    }]
}