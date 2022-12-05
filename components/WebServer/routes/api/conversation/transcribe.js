const debug = require('debug')('linto:conversation-manager:router:api:conversation:transcribe')

const { // Create conversation based on file
  transcribeReq
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/transcriptor.js`)


module.exports = (webserver) => {
  return [
    {
      path: '/create',
      method: 'post',
      requireAuth: true,
      controller: transcribeReq
    }
  ]
}