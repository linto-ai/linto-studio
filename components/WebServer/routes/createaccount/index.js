const debug = require('debug')('conversation-manager:interface:*')
const middlewares = require(`${process.cwd()}/components/WebServer/middlewares/index.js`)

module.exports = (webServer) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: false,
        controller: [
            (req, res, next) => {
                res.setHeader("Content-Type", "text/html")
                res.sendFile(process.cwd() + '/dist/index.html')
            }
        ] 
    }]
}