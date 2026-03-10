const debug = require("debug")("linto:components:IoHandler:controllers:SocketEvents")

// Event endpoints for other components to emit events to sockets
module.exports = function () {
  this.on("partial", (roomId, transcription) => {
    this.notify(roomId, "partial", transcription)
  })
  this.on("final", (roomId, transcription) => {
    this.notify(roomId, "final", transcription)
  })
  this.on("translation", (roomId, translation) => {
    this.notify(roomId, "translation", translation)
  })

  this.on("watch_organization", (roomId, sessions) => {
    this.notify_sessions(roomId, "session_update", sessions)
  })

  this.on("new_conversation_from_session", (session) => {
    this.notify_sessions_created(session.organizationId, session)
  })

  this.on("new_conversation", (conversation) => {
    this.notify_conversation_action(
      "created",
      conversation.organization.organizationId,
      conversation,
    )
  })

  this.on("conversation_deleted", (orgaIds, id, status) => {
    this.notify_conversation_action("deleted", orgaIds, { id, status })
  })

  this.on("folder_created", (orgaId, folder) => {
    this.notify_folder_action("created", orgaId, folder)
  })

  this.on("folder_updated", (orgaId, folder) => {
    this.notify_folder_action("updated", orgaId, folder)
  })

  this.on("folder_deleted", (orgaId, folderId) => {
    this.notify_folder_action("deleted", orgaId, { _id: folderId })
  })

  this.on("folders_refresh", (orgaId) => {
    this.io.to(orgaId).emit("folders_refresh")
  })

  this.on("conversation_folder_changed", (orgaId, payload) => {
    this.io.to(orgaId).emit("conversation_folder_changed", payload)
  })

  // MQTT broker client send this event when the connection is lost
  this.on("borker_disconnected", () => {
    this.brokerKo(true)
  })
}
