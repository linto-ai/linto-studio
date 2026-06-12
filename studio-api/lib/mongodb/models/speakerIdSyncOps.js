const MongoModel = require(`../model`)
const moment = require("moment")

const SYNC_OP = Object.freeze({
  UPSERT: "upsert",
  DELETE_SPEAKER: "delete_speaker",
  DROP_COLLECTION: "drop_collection",
})

/**
 * Reconciliation queue for Qdrant writes (cf. docs/speaker-identification
 * 04 §2.7 / §7). Operations are commutative per (qdrantCollectionName,
 * pointId) key: enqueueing removes older queued ops on the same key, and a
 * drop_collection purges every queued op of the collection.
 */
class SpeakerIdSyncOpModel extends MongoModel {
  constructor() {
    super("speakerIdSyncOps")
    this.SYNC_OP = SYNC_OP
  }

  async enqueue(payload) {
    try {
      if (!Object.values(SYNC_OP).includes(payload.op)) {
        throw new Error(`Invalid sync op: ${payload.op}`)
      }

      // Last intention wins: drop older ops on the same key
      if (payload.op === SYNC_OP.DROP_COLLECTION) {
        await this.deleteByCollection(payload.qdrantCollectionName)
      } else if (payload.pointId) {
        await this.deleteByPoint(payload.qdrantCollectionName, payload.pointId)
      }

      const dateTime = moment().format()
      const doc = {
        op: payload.op,
        qdrantCollectionName: payload.qdrantCollectionName,
        organizationId: this.getObjectId(payload.organizationId),
        pointId: payload.pointId || null,
        payload: payload.payload || null,
        voiceprintId: payload.voiceprintId
          ? this.getObjectId(payload.voiceprintId)
          : null,
        attempts: payload.attempts || 0,
        lastError: payload.lastError || null,
        created: dateTime,
        nextRetryAt: payload.nextRetryAt || dateTime,
      }
      return await this.mongoInsert(doc)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getDue(date) {
    try {
      const query = {
        nextRetryAt: { $lte: date || moment().format() },
      }
      return await this.mongoRequest(query, {
        sort: { nextRetryAt: 1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async markError(id, { attempts, lastError, nextRetryAt }) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      return await this.mongoUpdateOne(query, "$set", {
        attempts,
        lastError,
        nextRetryAt,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async delete(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      return await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteByPoint(qdrantCollectionName, pointId) {
    try {
      const query = {
        qdrantCollectionName,
        pointId,
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteByCollection(qdrantCollectionName) {
    try {
      const query = {
        qdrantCollectionName,
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllFromOrganization(organizationId) {
    try {
      const query = {
        organizationId: this.getObjectId(organizationId),
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new SpeakerIdSyncOpModel()
