const debug = require('debug')('linto:conversation-manager:router:api:services:service')

const { 
  getTranscriptionServices
} = require(`${process.cwd()}/components/WebServer/routecontrollers/services/service.js`)

module.exports = (webserver) => {
    return [
        {
            path: '/transcriptions',
            method: 'get',
            requireAuth: true,
            controller: getTranscriptionServices
        }
    ]
}