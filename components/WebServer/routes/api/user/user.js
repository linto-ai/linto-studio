const debug = require('debug')('app:router:api:user:user')
const {createUser, getUserbyId, getUserByName, deleteUser, addUserConvoAccess} = require(`${process.cwd()}/components/WebServer/routecontrollers/user/user.js`)
const {isOwner} = require(`${process.cwd()}/components/WebServer/middlewares`)


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
            path: '/:userid',
            method: 'delete',
            requireAuth: false,
            controller: deleteUser
        }, 
        {
            path: '/:userid/addaccess/:conversationid', 
            method: 'patch', 
            requireAuth: false, 
            controller: [isOwner, addUserConvoAccess] 
        }
    ]
}