const debug = require("debug")("linto:components:EditorHandler:onJoin")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const auth = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

// Name shown to other participants; resolved server-side so a client
// can't spoof it.
async function resolveUserName(userId) {
  const users = await model.users.getById(userId)
  const user = Array.isArray(users) ? users[0] : null
  if (!user) return ""
  return [user.firstname, user.lastname].filter(Boolean).join(" ")
}

function wireLock(lock) {
  return {
    translationId: lock.translationId,
    turnId: lock.turnId,
    userId: lock.userId,
    userName: lock.userName,
  }
}

// READ suffices to join (the room only carries broadcasts); WRITE is
// re-checked per mutation, so a revoked right needs no room eviction.
async function onJoin({ socket }, conversationId, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const user = await auth.checkSocket(socket)
    // Public session tokens authenticate without a userId; the editor is
    // for identified users only.
    if (!user || !user.isAuth || !user.userId) {
      debug(`join denied (unauthorized) socket=${socket.id}`)
      return reply({ ok: false, reason: "unauthorized" })
    }

    const canRead = await access.hasAccess(
      conversationId,
      user.userId,
      CONVERSATION_RIGHTS.READ,
    )
    if (!canRead) {
      debug(
        `join denied (forbidden) conv=${conversationId} user=${user.userId}`,
      )
      return reply({ ok: false, reason: "forbidden" })
    }

    // Per-track editorVersions let a reconnecting client refetch stale
    // tracks; the keys are the family, cached to bound later mutations.
    const versions =
      await model.conversationEditor.getFamilyEditorVersions(conversationId)

    socket.data.editorUser = {
      userId: user.userId,
      userName: await resolveUserName(user.userId),
    }
    socket.data.editorParentId = conversationId
    socket.data.editorFamily = new Set(Object.keys(versions))
    socket.join(computeEditorRoomName(conversationId))
    debug(`editor:join conv=${conversationId} user=${user.userId}`)

    const locks = await model.editorLocks.listByParent(conversationId)
    // users list arrives with its own iteration.
    reply({ ok: true, locks: locks.map(wireLock), users: [], versions })
  } catch (err) {
    debug(`join failed conv=${conversationId}: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onJoin }
