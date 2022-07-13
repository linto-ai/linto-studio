const debug = require('debug')('linto:conversation-manager:router:api:user:user')
const {
    listUser,
    searchUser,
    createUser,
    getUserById,
    updateUser,
    updateUserPassword,
    updateUserPicture,
    deleteUser,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/users.js`)

const auth_middleware = require(`${process.cwd()}/components/WebServer/config/passport/local/middleware`)


module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: true,
        controller: listUser
    },
    {
        path: '/',
        method: 'post',
        requireAuth: false,
        controller: createUser
    },
    {
        path: '/',
        method: 'delete',
        requireAuth: true,
        controller: deleteUser
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
        controller: [updateUserPassword, auth_middleware.authenticate]
    },
    {
        path: '/picture',
        method: 'put',
        requireAuth: true,
        controller: updateUserPicture
    },
    {
        path: '/search',
        method: 'post',
        requireAuth: true,
        controller: searchUser
    }, {
        path: '/:userid',
        method: 'get',
        requireAuth: true,
        controller: getUserById
    }
    ]
}