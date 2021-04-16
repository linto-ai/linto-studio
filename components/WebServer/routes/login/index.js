const debug = require('debug')('conversation-manager:interface:*')
const middlewares = require(`${process.cwd()}/components/WebServer/middlewares/index.js`)

module.exports = (webServer) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: true,
        controller: [
            (req, res, next) => {
                console.log('controller login')
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.cwd() + '/dist/login.html')
            }
        ] 
    }]
}