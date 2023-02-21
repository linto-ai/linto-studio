const debug = require('debug')('linto:conversation-manager:router:api:user:user')
const {
    listUser,
    searchUser,
    createUser,
    getUserById,
    getPersonalInfo,
    updateUser,
    updateUserPicture,
    deleteUser,
    recoveryAuth,
    sendVerificationEmail
} = require(`${process.cwd()}/components/WebServer/routecontrollers/users/users.js`)

const auth_middleware = require(`${process.cwd()}/components/WebServer/config/passport/local/middleware`)

module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: true,
        controller: getPersonalInfo
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
    },
    {
        path: '/list',
        method: 'get',
        requireAuth: true,
        controller: listUser
    },
    {
        path: '/reset-password',
        method: 'post',
        requireAuth: false,
        controller: recoveryAuth
    },
    {
        path: '/verify-email',
        method: 'patch',
        requireAuth: true,
        controller: sendVerificationEmail
    },
    {
        path: '/:userId',
        method: 'get',
        requireAuth: true,
        requireUserVisibility: true,
        controller: getUserById
    },
    ]
}