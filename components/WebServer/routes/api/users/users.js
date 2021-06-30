const debug = require('debug')('app:router:api:user:user')
const {
    getUsers,
    createUser,
    getUserById,
    updateUserInfos,
    updateUserPassword,
    deleteUser,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/users.js`)

module.exports = (webserver) => {
    return [{
            path: '/',
            method: 'get',
            requireAuth: true,
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
            controller: getUserById
        },
        {
            path: '/:userid/infos',
            method: 'put',
            requireAuth: true,
            controller: updateUserInfos
        },
        {
            path: '/:userid/pswd',
            method: 'put',
            requireAuth: true,
            controller: updateUserPassword
        },
        {
            path: '/:userid',
            method: 'delete',
            requireAuth: false,
            controller: deleteUser
        }
    ]
}