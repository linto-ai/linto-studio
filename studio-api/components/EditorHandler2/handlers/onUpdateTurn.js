const debug = require("debug")("linto:components:EditorHandler2:onUpdateTurn")

// PoC: log the payload and ack — no lock check, no persistence yet.
function onUpdateTurn({ socket }, payload, ack) {
  debug(
    `editor:update_turn socket=${socket.id} payload=${JSON.stringify(payload)}`,
  )
  if (typeof ack === "function") {
    ack({ ok: true })
  }
}

module.exports = { onUpdateTurn }
