const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:services:services')

const serviceUtility = require(`${process.cwd()}/components/WebServer/controllers/services/utility`)

async function getSaasServices(req, res, next) {
  try {
    const services = await serviceUtility.listSaasServices(req.params.scope)
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