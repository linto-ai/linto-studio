const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:services:utility')
const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const axios = require(`${process.cwd()}/lib/utility/axios`)

function getTranscriptionService(serviceName) {
  const tarnscription_services = JSON.parse(process.env.TRANSCRIPTION_SERVICES.split(','))

  for (let transcription_service of tarnscription_services) {
    if (serviceName === transcription_service.name) {
      return {
        name: transcription_service.name,
        host: transcription_service.host,
        locale: transcription_service.lang,
      }
    }
  }

  throw new ConversationError('Service not found')
}

async function listSaasServices(reduce = false) {
  const tarnscription_services = JSON.parse(process.env.TRANSCRIPTION_SERVICES.split(','))
  let services = {}

  for (let transcription_service of tarnscription_services) {
    if (!services[transcription_service.lang]) services[transcription_service.lang] = []

    let saas_service_info = await axios.get(transcription_service.host + '/list-services')
    if (reduce) {
      for (const saas_service_type in saas_service_info) {
        for (let i = 0; i < saas_service_info[saas_service_type].length; i++) {
          delete saas_service_info[saas_service_type][i].instances
        }
      }
    }
    transcription_service.sub_services = saas_service_info
    services[transcription_service.lang].push(transcription_service)
  }

  return services
}


module.exports = { getTranscriptionService, listSaasServices }