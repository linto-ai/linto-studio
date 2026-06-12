const MongoModel = require(`../model`)
const { SPEAKER_TYPE } = require(
  `${process.cwd()}/lib/dao/speakerIdentification/naming`,
)
const { STORAGE_MODE } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

/**
 * Voiceprints (one per subject): the computed embedding of a user or a
 * speaker label. Uniqueness on (subjectType, subjectId) is enforced
 * applicatively through upsert (cf. docs/speaker-identification 04 §2.3).
 * subjectId is stored as a string (hex) for both users and labels.
 */
class VoiceprintModel extends MongoModel {
  constructor() {
    super("voiceprints")
  }

  async getBySubject(subjectType, subjectId) {
    try {
      const query = {
        subjectType,
        subjectId: subjectId.toString(),
      }
      const result = await this.mongoRequest(query)
      return result[0] || null
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Insert or replace the voiceprint of a subject. The (subjectType,
   * subjectId) pair is the upsert key, which guarantees uniqueness.
   * fields may contain: vector, modelId, dim, computedAt, sourceSampleIds,
   * sourceDuration, storageMode (subjectType=user only).
   */
  async upsert(subjectType, subjectId, fields) {
    try {
      if (!Object.values(SPEAKER_TYPE).includes(subjectType)) {
        throw new Error(`Invalid voiceprint subject type: ${subjectType}`)
      }

      const allowed = {}
      if (fields.vector !== undefined) allowed.vector = fields.vector
      if (fields.modelId !== undefined) allowed.modelId = fields.modelId
      if (fields.dim !== undefined) allowed.dim = fields.dim
      if (fields.computedAt !== undefined) allowed.computedAt = fields.computedAt
      if (fields.sourceSampleIds !== undefined)
        allowed.sourceSampleIds = fields.sourceSampleIds.map((id) =>
          this.getObjectId(id),
        )
      if (fields.sourceDuration !== undefined)
        allowed.sourceDuration = fields.sourceDuration
      if (fields.syncState !== undefined) allowed.syncState = fields.syncState
      if (
        subjectType === SPEAKER_TYPE.USER &&
        fields.storageMode !== undefined
      ) {
        allowed.storageMode = fields.storageMode
      }

      const query = {
        subjectType,
        subjectId: subjectId.toString(),
      }
      await this.mongoUpdateOne(
        query,
        "$set",
        { ...query, ...allowed },
        { upsert: true },
      )
      return await this.getBySubject(subjectType, subjectId)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Default storage mode for a user voiceprint when the field is absent
   * (cf. 04 §2.6).
   */
  getStorageMode(voiceprint) {
    return voiceprint?.storageMode || STORAGE_MODE.AUDIO
  }

  hasComputedVoiceprint(voiceprint) {
    return Boolean(
      voiceprint && Array.isArray(voiceprint.vector) && voiceprint.vector.length > 0,
    )
  }

  async deleteBySubject(subjectType, subjectId) {
    try {
      const query = {
        subjectType,
        subjectId: subjectId.toString(),
      }
      return await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteBySubjectIds(subjectType, subjectIds) {
    try {
      const query = {
        subjectType,
        subjectId: { $in: subjectIds.map((id) => id.toString()) },
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllFromUser(userId) {
    return this.deleteBySubject(SPEAKER_TYPE.USER, userId)
  }
}

module.exports = new VoiceprintModel()
