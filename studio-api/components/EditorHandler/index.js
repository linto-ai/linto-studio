const debug = require("debug")("linto:components:EditorHandler")
const Component = require("../component.js")

const handlers = require("./handlers")
const { requireFamily, requireLock, requireWrite } = require("./decorators")

// prettier-ignore
const onUpdateTurnGuarded = requireFamily(requireWrite(requireLock(handlers.onUpdateTurn)))
// prettier-ignore
const onSplitTurnGuarded = requireFamily(requireWrite(requireLock(handlers.onSplitTurn)))
// prettier-ignore
const onDeleteTurnGuarded = requireFamily(requireWrite(requireLock(handlers.onDeleteTurn)))
// prettier-ignore
const onMergeTurnsGuarded = requireFamily(requireWrite(handlers.onMergeTurns))
// prettier-ignore
const onLockTurnGuarded = requireFamily(requireWrite(handlers.onLockTurn))
// prettier-ignore
const onUnlockTurnGuarded = requireFamily(handlers.onUnlockTurn)
// prettier-ignore
const onUpdateTurnSpeakerGuarded = requireFamily(requireWrite(handlers.onUpdateTurnSpeaker))
// prettier-ignore
const onRenameSpeakerGuarded = requireFamily(requireWrite(handlers.onRenameSpeaker))
// prettier-ignore
const onReplaceSpeakerGuarded = requireFamily(requireWrite(handlers.onReplaceSpeaker))
// prettier-ignore
const onUndoGuarded = requireFamily(requireWrite(handlers.onUndo))
// prettier-ignore
const onRedoGuarded = requireFamily(requireWrite(handlers.onRedo))

class EditorHandler extends Component {
  constructor(app) {
    super(app, "IoHandler")
    this.id = this.constructor.name
    this.app = app

    this.io = this.app.components["IoHandler"].io
    this.io.on("connection", (socket) => this.bindEditorEvents(socket))

    debug("EditorHandler ready (PoC)")
    return this.init()
  }

  bindEditorEvents(socket) {
    const io = this.io
    socket.on("editor:join", (conversationId, ack) =>
      handlers.onJoin({ socket }, conversationId, ack),
    )
    socket.on("editor:leave", (conversationId) =>
      handlers.onLeave({ io, socket }, conversationId),
    )
    socket.on("editor:update_turn", (payload, ack) =>
      onUpdateTurnGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:split_turn", (payload, ack) =>
      onSplitTurnGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:delete_turn", (payload, ack) =>
      onDeleteTurnGuarded({ io, socket }, payload, ack),
    )
    // NOT lock-decorated: the merge requires both turns FREE (see handler).
    socket.on("editor:merge_turns", (payload, ack) =>
      onMergeTurnsGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:update_turn_speaker", (payload, ack) =>
      onUpdateTurnSpeakerGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:rename_speaker", (payload, ack) =>
      onRenameSpeakerGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:replace_speaker", (payload, ack) =>
      onReplaceSpeakerGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:undo", (payload, ack) =>
      onUndoGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:redo", (payload, ack) =>
      onRedoGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:lock_turn", (payload, ack) =>
      onLockTurnGuarded({ io, socket }, payload, ack),
    )
    socket.on("editor:unlock_turn", (payload, ack) =>
      onUnlockTurnGuarded({ io, socket }, payload, ack),
    )
    socket.on("disconnect", () => handlers.onDisconnect({ io, socket }))
  }
}

module.exports = (app) => new EditorHandler(app)
