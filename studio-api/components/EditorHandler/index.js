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
const { onDisconnect } = require("./handlers/onDisconnect")
const { requireFamily } = require("./decorators/requireFamily")
const { requireLock } = require("./decorators/requireLock")
const { requireWrite } = require("./decorators/requireWrite")

// Uniform rights policy, auditable here and nowhere else. Every mutation
// goes through requireFamily (the payload's track must belong to the joined
// conversation — and it gives handlers the broadcast room via
// socket.data.editorParentId), then requireWrite (rights live on the edited
// track), then requireLock where holding the turn's lock is mandatory.
// lock_turn IS the heartbeat: requireWrite re-checks WRITE on every beat.
// merge takes no requireLock — it needs both turns FREE (see handler).
// unlock_turn deliberately skips requireWrite: a user whose right was
// revoked mid-edit must still release their own lock (socket-scoped
// release, mutates nothing).
const onUpdateTurnGuarded = requireFamily(requireWrite(requireLock(onUpdateTurn)))
const onSplitTurnGuarded = requireFamily(requireWrite(requireLock(onSplitTurn)))
const onDeleteTurnGuarded = requireFamily(requireWrite(requireLock(onDeleteTurn)))
const onMergeTurnsGuarded = requireFamily(requireWrite(onMergeTurns))
const onLockTurnGuarded = requireFamily(requireWrite(onLockTurn))
const onUnlockTurnGuarded = requireFamily(onUnlockTurn)
const onUpdateTurnSpeakerGuarded = requireFamily(requireWrite(onUpdateTurnSpeaker))
const onRenameSpeakerGuarded = requireFamily(requireWrite(onRenameSpeaker))
const onReplaceSpeakerGuarded = requireFamily(requireWrite(onReplaceSpeaker))

// PoC of the lock+save editor (see Notion "Editor v2"): rides on IoHandler's
// socket.io server, one room per PARENT conversation; mutation payloads carry
// the translationId (child conversation). One file per handler in handlers/.
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
