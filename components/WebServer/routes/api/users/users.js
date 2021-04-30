const debug = require('debug')('app:router:api:user:user')
const {
    getUsers,
    createUser,
    getUserbyId,
    deleteUser,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/users.js`)

module.exports = (webserver) => {
    return [{
            path: '/',
            method: 'get',
            requireAuth: false,
            controller: getUsers
        },
        {
            path: '/',
            method: 'post',
            requireAuth: false,
            controller: createUser
        },
        {
            path: '/:userid',
            method: 'get',
            requireAuth: true,
            controller: getUserbyId
        },
        {
            path: '/:userid',
            method: 'delete',
            requireAuth: false,
            controller: deleteUser
        }
    ]
}