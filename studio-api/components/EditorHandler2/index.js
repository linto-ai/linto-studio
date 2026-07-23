const debug = require("debug")("linto:components:EditorHandler2")
const Component = require("../component.js")

const { onJoin } = require("./handlers/onJoin")
const { onLeave } = require("./handlers/onLeave")
const { onUpdateTurn } = require("./handlers/onUpdateTurn")
const { onLockTurn } = require("./handlers/onLockTurn")
const { onUnlockTurn } = require("./handlers/onUnlockTurn")
const { onSplitTurn } = require("./handlers/onSplitTurn")
const { onDisconnect } = require("./handlers/onDisconnect")
const { requireLock } = require("./handlers/requireLock")

// Mutations run only for the lock holder (decorated once at module level).
const onUpdateTurnLocked = requireLock(onUpdateTurn)
const onSplitTurnLocked = requireLock(onSplitTurn)

// PoC of the lock+save editor (see Notion "Editor v2"): rides on IoHandler's
// socket.io server, one room per PARENT conversation; mutation payloads carry
// the translationId (child conversation). One file per handler in handlers/.
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
    const io = this.io
    socket.on("editor:join", (conversationId, ack) =>
      onJoin({ socket }, conversationId, ack),
    )
    socket.on("editor:leave", (conversationId) =>
      onLeave({ io, socket }, conversationId),
    )
    socket.on("editor:update_turn", (payload, ack) =>
      onUpdateTurnLocked({ io, socket }, payload, ack),
    )
    socket.on("editor:split_turn", (payload, ack) =>
      onSplitTurnLocked({ io, socket }, payload, ack),
    )
    socket.on("editor:lock_turn", (payload, ack) =>
      onLockTurn({ io, socket }, payload, ack),
    )
    socket.on("editor:unlock_turn", (payload, ack) =>
      onUnlockTurn({ io, socket }, payload, ack),
    )
    socket.on("disconnect", () => onDisconnect({ io, socket }))
  }
}

module.exports = (app) => new EditorHandler2(app)
