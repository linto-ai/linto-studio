const debug = require("debug")("delivery:IoHandler:socket-event")

module.exports = function () {
  this.on("partial", (roomId, transcription) => {
    this.notify(roomId, "partial", transcription)
  })
  this.on("final", (roomId, transcription) => {
    this.notify(roomId, "final", transcription)
  })
}
