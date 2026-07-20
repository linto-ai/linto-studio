const debug = require("debug")("linto:components:EditorHandler2")
const Component = require("../component.js")
const { computeEditorRoomName } = require("./utils/computeEditorRoomName")

// PoC of the lock+save editor (see Notion "Editor v2"): rides on IoHandler's
// socket.io server, one room per conversation. For now: log incoming editor
// events and ack them — no lock, no persistence yet.
class EditorHandler2 extends Component {
  constructor(app) {
    super(app, "IoHandler")
    this.id = this.constructor.name
    this.app = app

    this.io = this.app.components["IoHandler"].io
    this.io.on("connection", (socket) => this.bindEditorEvents(socket))

    debug("EditorHandler2 ready (PoC)")
    return this.init()
  }

  bindEditorEvents(socket) {
    socket.on("editor:join", (conversationId, ack) => {
      debug(`editor:join conv=${conversationId} socket=${socket.id}`)
      socket.join(computeEditorRoomName(conversationId))
      if (typeof ack === "function") {
        ack({ ok: true, locks: [], users: [], version: 0 })
      }
    })

    socket.on("editor:leave", (conversationId) => {
      debug(`editor:leave conv=${conversationId} socket=${socket.id}`)
      socket.leave(computeEditorRoomName(conversationId))
    })

    socket.on("editor:update_turn", (payload, ack) => {
      debug(
        `editor:update_turn socket=${socket.id} payload=${JSON.stringify(payload)}`,
      )
      if (typeof ack === "function") {
        ack({ ok: true })
      }
    })
  }
}

module.exports = (app) => new EditorHandler2(app)
