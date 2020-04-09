const debug = require('debug')('app:router:api:user')
const { createUser, getUserbyId, getUserByEmail, getUserByName, deleteUser } = require(`${process.cwd()}/components/WebServer/routecontrollers/users/index.js`)



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
        }, {
            path: '/name/:username',
            method: 'get',
            requireAuth: false,
            controller: getUserByName
        },
        {
            path: '/email/:email',
            method: 'get',
            requireAuth: false,
            controller: getUserByEmail
        },
        {
            path: '/:userid',
            method: 'delete',
            requireAuth: false,
            controller: deleteUser
        }
    ]
}