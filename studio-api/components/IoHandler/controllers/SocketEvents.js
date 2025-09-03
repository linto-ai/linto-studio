const debug = require("debug")("linto:components:IoHandler:socket-event")

// Event endpoints for other components to emit events to sockets
module.exports = function () {
  this.on("partial", (roomId, transcription) => {
    this.notify(roomId, "partial", transcription)
  })
  this.on("final", (roomId, transcription) => {
    this.notify(roomId, "final", transcription)
  })

  this.on("watch_organization", (roomId, sessions) => {
    this.notify_sessions(roomId, "session_update", sessions)
  })

  this.on("new_conversation", (conversation) => {
    const orgaId = conversation.organization.organizationId
    this.notify_conversation_created(orgaId, conversation)
  })
}
