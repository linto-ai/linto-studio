const MongoModel = require(`../model`)
const MongoDriver = require(`../driver`)

/**
 * Per-turn edit locks for the lock+save editor (see "Editor v2" design).
 *
 * One document per held lock, keyed { translationId, turnId } — the language
 * track (child conversation) is the locking scope, so two users editing the
 * same turn on different tracks don't conflict. parentId is denormalized so
 * the join ack can list a whole conversation's locks and disconnect cleanup
 * can address the right room, without parent lookups.
 *
 * Expiry is LAZY: `expiresAt` compared to now is the truth everywhere; the
 * TTL index only garbage-collects (its ~60s sweep cadence is irrelevant to
 * correctness). The unique index IS the lock: a concurrent acquire loses by
 * duplicate-key error, never by a read-then-write race.
 */

// Server-side lock lifetime. The client re-emits lock_turn (acquire-or-
// refresh) about every 15s while editing — 3 missed beats lose the lock.
const LOCK_TTL_MS = 45000

class EditorLocksModel extends MongoModel {
  constructor() {
    super("editorLocks")
  }

  getCollection() {
    return MongoDriver.constructor.db.collection(this.collection)
  }

  /**
   * Acquire-or-refresh, atomically (the client heartbeats through this).
   * @returns {Promise<{acquired: true, refreshed: boolean}
   *   | {acquired: false, holder: object|null}>}
   *   `refreshed` — the caller already held it (no broadcast needed).
   *   `holder` — the live lock's owner; null when it vanished between the
   *   conflict and the read (caller treats it as retryable).
   */
  async acquire(
    { parentId, translationId, turnId, userId, socketId, userName },
    ttlMs = LOCK_TTL_MS,
  ) {
    const now = new Date()
    try {
      const previous = await this.getCollection().findOneAndUpdate(
        {
          translationId,
          turnId,
          $or: [{ socketId }, { expiresAt: { $lte: now } }],
        },
        {
          $set: {
            parentId,
            translationId,
            turnId,
            userId,
            socketId,
            userName,
            expiresAt: new Date(now.getTime() + ttlMs),
          },
        },
        {
          upsert: true,
          returnDocument: "before",
          includeResultMetadata: false,
        },
      )
      return {
        acquired: true,
        refreshed: previous !== null && previous.socketId === socketId,
      }
    } catch (error) {
      // Live lock held by another socket: the filter matched nothing, the
      // upsert insert hit the unique index.
      if (error?.code === 11000) {
        const holder = await this.getCollection().findOne({
          translationId,
          turnId,
        })
        return { acquired: false, holder }
      }
      throw error
    }
  }

  /** Does this socket hold a LIVE lock on the turn? (lazy expiry: an expired
   *  document is no lock, even before the TTL sweep collects it). */
  async isHeldBy(translationId, turnId, socketId) {
    const lock = await this.getCollection().findOne({
      translationId,
      turnId,
      socketId,
      expiresAt: { $gt: new Date() },
    })
    return lock !== null
  }

  /** Release the caller's own lock. @returns {Promise<boolean>} released? */
  async release(translationId, turnId, socketId) {
    const result = await this.getCollection().deleteOne({
      translationId,
      turnId,
      socketId,
    })
    return result.deletedCount > 0
  }

  /**
   * Release every lock held by a socket — on disconnect, or scoped to one
   * conversation on editor:leave (the app socket outlives the editor view).
   * @param {string} socketId
   * @param {{parentId?: string}} [scope] - narrow the release to one parent
   * @returns {Promise<object[]>} the released lock documents — the caller
   *   broadcasts one turn_unlocked per document to its parent's room.
   */
  async releaseAllForSocket(socketId, { parentId } = {}) {
    const filter = parentId ? { socketId, parentId } : { socketId }
    const locks = await this.getCollection().find(filter).toArray()
    if (locks.length > 0) {
      await this.getCollection().deleteMany(filter)
    }
    return locks
  }

  /** Live locks of a whole conversation (all tracks) — the join ack. */
  async listByParent(parentId) {
    return await this.getCollection()
      .find({ parentId, expiresAt: { $gt: new Date() } })
      .toArray()
  }
}

module.exports = new EditorLocksModel()
module.exports.LOCK_TTL_MS = LOCK_TTL_MS
