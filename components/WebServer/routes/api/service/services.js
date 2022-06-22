const debug = require('debug')('app:router:api:services:service')

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