const debug = require('debug')('linto:conversation-manager:routes:auth')

const { logout } = require(`${process.cwd()}/components/WebServer/routecontrollers/users/users.js`)
const auth_middleware = require(`${process.cwd()}/components/WebServer/config/passport/local/middleware`)


module.exports = (webServer) => {
    return [
        {
            path: '/login',
            method: 'post',
            requireAuth: false,
            controller: [
                auth_middleware.authenticate,
                (req, res, next) => {
                    res.status(202).json(req.user)
                }
            ]
        },        {
            path: '/login/reset',
            method: 'post',
            requireAuth: false,
            controller: [
                auth_middleware.authenticate_reset,
                (req, res, next) => {
                    res.status(202).json(req.user)
                }
            ]
        },
        {
            path: '/logout',
            method: 'get',
            requireAuth: true,
            controller: logout
        }, 
        {
            path: '/isAuth',
            method: 'get',
            requireAuth: true,
            controller: async(req, res, next) => {
                res.status(200).send('Ok')
            }
        }
    ]
}