/**
 * Reconciliation worker for the speaker identification Qdrant index.
 *
 * Qdrant writes that failed inline are queued in `speakerIdSyncOps`. This
 * worker periodically replays the due operations, reconstructing upsert data
 * from Mongo (the source of truth) so no embedding is copied in the queue.
 * Failed replays are rescheduled with exponential backoff capped at one hour;
 * operations are never abandoned (RGPD: an opt-out must eventually apply).
 * cf. docs/speaker-identification 04 §7, 07 §2.5.
 */

const debug = require("debug")(
  "linto:components:WebServer:controllers:speakerIdentification:sync",
)
const moment = require("moment")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const connector = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
)
const { SPEAKER_TYPE, displayName, SPEAKER_REF_REGEX } = require(
  `${process.cwd()}/lib/dao/speakerIdentification/naming`,
)

const SYNC_OP = model.speakerIdSyncOps.SYNC_OP

const MAX_BACKOFF_SECONDS = 3600
const ALERT_AGE_HOURS = 24

let _timer = null
let _running = false

function baseRetrySeconds() {
  return parseInt(process.env.SPEAKER_ID_SYNC_RETRY_INTERVAL, 10) || 60
}

function nextRetryAt(attempts) {
  const backoff = Math.min(
    baseRetrySeconds() * Math.pow(2, attempts),
    MAX_BACKOFF_SECONDS,
  )
  return moment().add(backoff, "seconds").format()
}

function parseSpeakerRef(ref) {
  if (!ref || !SPEAKER_REF_REGEX.test(ref)) return null
  const [type, id] = ref.split(":")
  return { type, id }
}

async function resolveUpsertData(op) {
  const ref = parseSpeakerRef(op.pointId)
  if (!ref) return null

  const voiceprint = await model.voiceprints.getBySubject(ref.type, ref.id)
  if (!model.voiceprints.hasComputedVoiceprint(voiceprint)) {
    // The voiceprint no longer exists: the queued upsert is obsolete
    return null
  }

  let name = null
  if (ref.type === SPEAKER_TYPE.LABEL) {
    const labels = await model.speakerLabels.getById(ref.id)
    if (!labels || labels.length === 0) return null
    name = labels[0].name
  } else {
    const users = await model.users.getById(ref.id, true)
    name = displayName(users && users[0]) || ref.id
  }

  return { ref: op.pointId, name, vector: voiceprint.vector, modelId: voiceprint.modelId }
}

async function applyOp(op) {
  const organizationId = op.organizationId.toString()
  if (op.op === SYNC_OP.DROP_COLLECTION) {
    await connector.dropCollection(organizationId, op.qdrantCollectionName)
    return
  }
  if (op.op === SYNC_OP.DELETE_SPEAKER) {
    await connector.deleteSpeaker(
      organizationId,
      op.qdrantCollectionName,
      op.pointId,
    )
    return
  }
  if (op.op === SYNC_OP.UPSERT) {
    const data = await resolveUpsertData(op)
    if (!data) {
      // Nothing left to upsert (voiceprint or label gone): drop the op
      return
    }
    await connector.upsertSpeaker(
      organizationId,
      op.qdrantCollectionName,
      data.ref,
      { name: data.name, vector: data.vector, modelId: data.modelId },
    )
    return
  }
  throw new Error(`Unknown sync op: ${op.op}`)
}

/** Process all due reconciliation operations once. Returns counts. */
async function processDueOps() {
  let processed = 0
  let failed = 0
  const dueOps = await model.speakerIdSyncOps.getDue()
  if (!Array.isArray(dueOps)) return { processed, failed }

  for (const op of dueOps) {
    try {
      await applyOp(op)
      await model.speakerIdSyncOps.delete(op._id.toString())
      processed += 1
    } catch (err) {
      failed += 1
      const attempts = (op.attempts || 0) + 1
      const ageHours = moment().diff(moment(op.created), "hours")
      if (ageHours >= ALERT_AGE_HOURS) {
        console.error(
          `[speaker-id sync] op ${op._id} on ${op.qdrantCollectionName} still failing after ${ageHours}h: ${err.message}`,
        )
      }
      await model.speakerIdSyncOps.markError(op._id.toString(), {
        attempts,
        lastError: err.message,
        nextRetryAt: nextRetryAt(attempts),
      })
    }
  }
  return { processed, failed }
}

async function tick() {
  if (_running) return
  _running = true
  try {
    const { processed, failed } = await processDueOps()
    if (processed || failed) {
      debug("reconciliation tick: %d processed, %d failed", processed, failed)
    }
  } catch (err) {
    debug("reconciliation tick error: %s", err.message)
  } finally {
    _running = false
  }
}

/** Start the periodic reconciliation worker (idempotent). */
function start() {
  if (_timer) return
  if (process.env.ENABLE_SPEAKER_IDENTIFICATION !== "true") return
  const intervalMs = baseRetrySeconds() * 1000
  _timer = setInterval(tick, intervalMs)
  if (_timer.unref) _timer.unref()
  debug("speaker identification reconciliation worker started (every %ds)", baseRetrySeconds())
}

function stop() {
  if (_timer) {
    clearInterval(_timer)
    _timer = null
  }
}

module.exports = { start, stop, processDueOps, tick }
