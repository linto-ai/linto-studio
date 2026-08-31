const debug = require("debug")("linto:components:EditorHandler")
const Component = require("../component.js")

const { onJoin } = require("./handlers/onJoin")
const { onLeave } = require("./handlers/onLeave")
const { onUpdateTurn } = require("./handlers/onUpdateTurn")
const { onLockTurn } = require("./handlers/onLockTurn")
const { onUnlockTurn } = require("./handlers/onUnlockTurn")
const { onSplitTurn } = require("./handlers/onSplitTurn")
const { onDeleteTurn } = require("./handlers/onDeleteTurn")
const { onMergeTurns } = require("./handlers/onMergeTurns")
const { onUpdateTurnSpeaker } = require("./handlers/onUpdateTurnSpeaker")
const { onRenameSpeaker } = require("./handlers/onRenameSpeaker")
const { onReplaceSpeaker } = require("./handlers/onReplaceSpeaker")
const { onUndo } = require("./handlers/onUndo")
const { onRedo } = require("./handlers/onRedo")
const { onDisconnect } = require("./handlers/onDisconnect")
const { requireFamily } = require("./decorators/requireFamily")
const { requireLock } = require("./decorators/requireLock")
const { requireWrite } = require("./decorators/requireWrite")

// prettier-ignore
const onUpdateTurnGuarded = requireFamily(requireWrite(requireLock(onUpdateTurn)))
// prettier-ignore
const onSplitTurnGuarded = requireFamily(requireWrite(requireLock(onSplitTurn)))
// prettier-ignore
const onDeleteTurnGuarded = requireFamily(requireWrite(requireLock(onDeleteTurn)))
// prettier-ignore
const onMergeTurnsGuarded = requireFamily(requireWrite(onMergeTurns))
// prettier-ignore
const onLockTurnGuarded = requireFamily(requireWrite(onLockTurn))
// prettier-ignore
const onUnlockTurnGuarded = requireFamily(onUnlockTurn)
// prettier-ignore
const onUpdateTurnSpeakerGuarded = requireFamily(requireWrite(onUpdateTurnSpeaker))
// prettier-ignore
const onRenameSpeakerGuarded = requireFamily(requireWrite(onRenameSpeaker))
// prettier-ignore
const onReplaceSpeakerGuarded = requireFamily(requireWrite(onReplaceSpeaker))
// prettier-ignore
const onUndoGuarded = requireFamily(requireWrite(onUndo))
// prettier-ignore
const onRedoGuarded = requireFamily(requireWrite(onRedo))

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
      onJoin({ socket }, conversationId, ack),
    )
    socket.on("editor:leave", (conversationId) =>
      onLeave({ io, socket }, conversationId),
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
    socket.on("disconnect", () => onDisconnect({ io, socket }))
  }
}

module.exports = (app) => new EditorHandler(app)
