const debug = require('debug')('linto:conversation-manager:router:api:services:service')

const {
    getSaasServices,
    getWorkerServices
} = require(`${process.cwd()}/components/WebServer/routecontrollers/services/service.js`)

module.exports = (webserver) => {
    if (webserver.app.components['WorkerWatcher']) {
        return [
            {
                path: '',
                method: 'get',
                requireAuth: true,
                controller: getWorkerServices.bind(webserver)
            }
        ]
    } else {
        return [
            {
                path: '',
                method: 'get',
                requireAuth: true,
                controller: getSaasServices
            },
            {
                path: '/:scope',
                method: 'get',
                requireAuth: true,
                controller: getSaasServices
            }
        ]
    }
}