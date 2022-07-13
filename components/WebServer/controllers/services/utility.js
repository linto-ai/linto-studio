const debug = require('debug')('linto:conversation-manager:components:WebServer:controller:services:utility')
const { ConversationError } = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

function getTranscriptionService(serviceName) {
  const services_list = process.env.STT_SERVICES.split('~')

  for (let services of services_list) {
    let service = services.split(',')
    if (service[0] === serviceName) return {
      name: service[0],
      locale: service[1],
      host: service[2]
    }
  }
  throw new ConversationError('Service not found')
}

module.exports = { getTranscriptionService }