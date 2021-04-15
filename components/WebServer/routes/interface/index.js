const debug = require('debug')('conversation-manager:interface:*')

module.exports = (webServer) => {
    return [{
        path: '/*',
        method: 'get',
        requireAuth: false,
        controller: (req, res, next) => {
            res.setHeader("Content-Type", "text/html")
            console.log(process.cwd() + '/dist/index.html')
            res.sendFile(process.cwd() + '/dist/index.html')
        }
    }]
}