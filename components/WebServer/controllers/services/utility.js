const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:services:utility')
const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const axios = require(`${process.cwd()}/lib/utility/axios`)

async function listSaasServices() {
  const gateway_services = process.env.GATEWAY_SERVICES
  let services = []

  const saas_service_info = await axios.get(gateway_services + '/gateway/services')
  for (const transcription_service of saas_service_info.transcription) {
    services.push(transcription_service)
  }

  return services
}


module.exports = { listSaasServices }