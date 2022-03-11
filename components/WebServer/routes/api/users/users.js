const debug = require('debug')('app:router:api:user:user')
const {
    listUser,
    createUser,
    getUserById,
    updateUser,
    updateUserPassword,
    updateUserPicture,
    deleteUserOrganization,
    deleteUser,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/users.js`)

module.exports = (webserver) => {
    return [{
            path: '/',
            method: 'get',
            requireAuth: true,
            controller: listUser
        }, {
            path: '/:userid',
            method: 'get',
            requireAuth: true,
            controller: getUserById
        },
        {
            path: '/',
            method: 'post',
            requireAuth: false,
            controller: createUser
        },
        {
            path: '/',
            method: 'put',
            requireAuth: true,
            controller: updateUser
        },
        {
            path: '/password',
            method: 'put',
            requireAuth: true,
            controller: updateUserPassword
        },
        {
            path: '/picture',
            method: 'put',
            requireAuth: true,
            controller: updateUserPicture
        },
        {
            path: '/',
            method: 'delete',
            requireAuth: true,
            controller: deleteUser
        }
    ]
}