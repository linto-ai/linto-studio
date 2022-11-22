const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:services:utility')
const { ServiceError } = require(`${process.cwd()}/components/WebServer/error/exception/service`)

const axios = require(`${process.cwd()}/lib/utility/axios`)

async function listSaasServices() {
  try {

    const gateway_services = process.env.GATEWAY_SERVICES
    let services = []

    const saas_service_info = await axios.get(gateway_services + '/gateway/services')
    for (const transcription_service of saas_service_info.transcription) {
      services.push(transcription_service)
    }

    if (services.length === 0) throw new ServiceError('No transcription service found')
    return services
  } catch (err) {
    throw new ServiceError('Error while listing services')
  }
}


module.exports = { listSaasServices }