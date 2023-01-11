const debug = require('debug')('linto:conversation-manager:router:api:conversation:generate')

const { // Create conversation based on file
  transcribeReq
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/transcriptor.js`)

const { // Create conversation based on file
  importConversation
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/import.js`)


module.exports = (webserver) => {
  return [
    {
      path: '/create',
      method: 'post',
      requireAuth: true,
      controller: transcribeReq
    },
    {
      path: '/import',
      method: 'post',
      requireAuth: true,
      controller: importConversation
    },
  ]
}