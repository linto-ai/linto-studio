const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:organizations:member')
const organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

async function getTranscriptionServices(req, res, next) {
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

module.exports = {
  getTranscriptionServices
}