const debug = require('debug')('conversation-manager:interface:*')
const middlewares = require(`${process.cwd()}/components/WebServer/middlewares/index.js`)

module.exports = (webServer) => {
    return [{
            path: '/',
            method: 'get',
            requireSession: true,
            controller: [
                (req, res, next) => {
                    res.redirect('/interface/conversations')
                }
            ]
        },
        {
            // Conversation create
            path: '/conversation/create',
            method: 'get',
            requireSession: true,
            controller: [
                (req, res, next) => {
                    res.setHeader("Content-Type", "text/html")
                    res.sendFile(process.cwd() + '/dist/index.html')
                }
            ]
        },
        {
            // Conversation overview
            path: '/conversation/:convoId',
            method: 'get',
            requireSession: true,
            requireFrontReadAccess: true,
            controller: [
                (req, res, next) => {
                    res.setHeader("Content-Type", "text/html")
                    res.sendFile(process.cwd() + '/dist/index.html')
                }
            ]
        },
        {
            // Conversation transcription
            path: '/conversation/:convoId/transcription',
            method: 'get',
            requireSession: true,
            requireFrontReadAccess: true,
            controller: [
                (req, res, next) => {
                    res.setHeader("Content-Type", "text/html")
                    res.sendFile(process.cwd() + '/dist/index.html')
                }
            ]
        },
        {
            path: '/*',
            method: 'get',
            requireSession: true,
            controller: [
                (req, res, next) => {
                    res.setHeader("Content-Type", "text/html")
                    res.sendFile(process.cwd() + '/dist/index.html')
                }
            ]
        }
    ]
}