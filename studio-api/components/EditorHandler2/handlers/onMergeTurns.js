const debug = require("debug")("linto:components:EditorHandler2:onMergeTurns")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)
const { computeMergedTurn } = require("../utils/computeMergedTurn")
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")
const { toWireTurn } = require("../utils/toWireTurn")

/**
 * Merge two adjacent turns. The one mutation with INVERTED lock semantics:
 * it requires both turns to be FREE — requester included (no requireLock).
 * WRITE access is therefore checked here (the other mutations inherit it
 * from the lock acquisition). The ms between the lock check and the write
 * are an accepted race; the adjacency itself is re-checked atomically by
 * the write's filter.
 */
async function onMergeTurns({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const editorUser = socket.data.editorUser
    if (!editorUser) {
      return reply({ ok: false, reason: "unauthorized" })
    }
    const { parentId, translationId, firstTurnId, secondTurnId } = payload || {}
    if (!parentId || !translationId || !firstTurnId || !secondTurnId) {
      return reply({ ok: false, reason: "invalid_payload" })
    }

    const canWrite = await access.hasAccess(
      translationId,
      editorUser.userId,
      CONVERSATION_RIGHTS.WRITE,
    )
    if (!canWrite) {
      return reply({ ok: false, reason: "forbidden" })
    }

    const liveLocks = await model.editorLocks.findLiveLocks(translationId, [
      firstTurnId,
      secondTurnId,
    ])
    if (liveLocks.length > 0) {
      const holder = liveLocks[0]
      debug(`merge refused (locked) turn=${holder.turnId} by=${holder.userId}`)
      return reply({
        ok: false,
        reason: "locked",
        holder: { userId: holder.userId, userName: holder.userName },
      })
    }

    const conversations = await model.conversations.getById(translationId, [
      "text",
    ])
    if (!conversations || conversations.length !== 1) {
      return reply({ ok: false, reason: "conflict" })
    }
    const turns = conversations[0].text || []
    const firstIndex = turns.findIndex((t) => t.turn_id === firstTurnId)
    const firstTurn = turns[firstIndex]
    const secondTurn = turns[firstIndex + 1]
    if (!firstTurn || !secondTurn) {
      return reply({ ok: false, reason: "conflict" })
    }
    if (secondTurn.turn_id !== secondTurnId) {
      return reply({ ok: false, reason: "not_adjacent" })
    }

    const merged = computeMergedTurn(firstTurn, secondTurn)
    const updated = await model.conversations.mergeEditorTurns(
      translationId,
      firstTurnId,
      secondTurnId,
      merged,
    )
    if (!updated) {
      return reply({ ok: false, reason: "conflict" })
    }

    const removedTurnId =
      merged.turn_id === firstTurnId ? secondTurnId : firstTurnId
    debug(
      `merged turns=${firstTurnId}+${secondTurnId} → ${merged.turn_id} version=${updated.version}`,
    )
    io.to(computeEditorRoomName(parentId)).emit("editor:turns_merged", {
      translationId,
      mergedTurnId: merged.turn_id,
      removedTurnId,
      turn: toWireTurn(merged),
      version: updated.version,
    })
    reply({ ok: true, version: updated.version })
  } catch (err) {
    debug(`merge failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onMergeTurns }
