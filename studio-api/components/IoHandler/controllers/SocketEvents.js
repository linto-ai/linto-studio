const debug = require("debug")("linto:components:IoHandler:socket-event")

module.exports = function () {
  this.on("partial", (roomId, transcription) => {
    this.notify(roomId, "partial", transcription)
  })
  this.on("final", (roomId, transcription) => {
    this.notify(roomId, "final", transcription)
  })

  this.on("watcher_status", (roomId, sessions) => {
    this.notify_sessions(roomId, "watcher_status", sessions)
  })
}
