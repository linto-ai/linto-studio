const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:services:services')

async function getSaasServices(req, res, next) {
  try {
    const services_list = process.env.STT_SERVICES.split('~')
    const services = services_list.map(service => {
      service = service.split(',')
      return {
        name: service[0],
        lang: service[1],
        host: service[2]
      }
    })
    res.status(200).send(services)

  } catch (err) {
    next(err)
  }
}

async function getWorkerServices(req, res, next) {
  try {
    if (!this.app.components['WorkerWatcher']) {
      res.status(404).send('WorkerWatcher component not properly loaded')

    } else {
      const services = await this.app.components['WorkerWatcher'].list()
      res.status(200).send(services)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSaasServices,
  getWorkerServices
}