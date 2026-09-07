const MongoModel = require(`../model`)
const MongoDriver = require(`../driver`)

/**
 * Per-turn edit locks, one document per held lock keyed { translationId,
 * turnId }: the language track is the locking scope. parentId is denormalized
 * to list a conversation's locks without parent lookups. The unique index is
 * the lock (concurrent acquires lose by duplicate-key error); the TTL index is
 * garbage collection only, every query must compare expiresAt itself (lazy
 * expiry).
 */

// Server-side lock lifetime; the client refreshes about every 15s while
// editing, 3 missed beats lose the lock.
const LOCK_TTL_MS = 45000

class EditorLocksModel extends MongoModel {
  constructor() {
    super("editorLocks")
  }

  getCollection() {
    return MongoDriver.constructor.db.collection(this.collection)
  }

  /**
   * Acquire-or-refresh, atomically. Returns {acquired, refreshed} on success
   * (refreshed: the caller already held it), {acquired: false, holder} on
   * conflict (holder null when the lock vanished in between: retryable).
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
      // Live lock held by another socket: the upsert hit the unique index.
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

  async isHeldBy(translationId, turnId, socketId) {
    const lock = await this.getCollection().findOne({
      translationId,
      turnId,
      socketId,
      expiresAt: { $gt: new Date() },
    })
    return lock !== null
  }

  async release(translationId, turnId, socketId) {
    const result = await this.getCollection().deleteOne({
      translationId,
      turnId,
      socketId,
    })
    return result.deletedCount > 0
  }

  /**
   * Release every lock held by a socket, optionally scoped to one parent
   * conversation. Returns the released lock documents so the caller can
   * broadcast one turn_unlocked per document.
   */
  async releaseAllForSocket(socketId, { parentId } = {}) {
    const filter = parentId ? { socketId, parentId } : { socketId }
    const locks = await this.getCollection().find(filter).toArray()
    if (locks.length > 0) {
      await this.getCollection().deleteMany(filter)
    }
    return locks
  }

  async findLiveLocks(translationId, turnIds) {
    return await this.getCollection()
      .find({
        translationId,
        turnId: { $in: turnIds },
        expiresAt: { $gt: new Date() },
      })
      .toArray()
  }

  async listByParent(parentId) {
    return await this.getCollection()
      .find({ parentId, expiresAt: { $gt: new Date() } })
      .toArray()
  }
}

module.exports = new EditorLocksModel()
module.exports.LOCK_TTL_MS = LOCK_TTL_MS
