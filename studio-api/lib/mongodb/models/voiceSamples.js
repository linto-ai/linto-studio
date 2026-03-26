const MongoModel = require(`../model`)
const moment = require("moment")
const {
  VOICE_SAMPLE_TYPE,
  STORAGE_MODE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

class VoiceSampleModel extends MongoModel {
  constructor() {
    super("voiceSamples")
  }

  async create(payload) {
    try {
      const dateTime = moment().format()

      const type = payload.type || VOICE_SAMPLE_TYPE.LABEL
      if (!Object.values(VOICE_SAMPLE_TYPE).includes(type)) {
        throw new Error(`Invalid voice sample type: ${type}`)
      }

      const doc = {
        created: dateTime,
        last_update: dateTime,
        type,
        format: payload.format || STORAGE_MODE.AUDIO,
        audioFilePath: payload.audioFilePath,
      }

      // Label-type fields
      if (payload.speakerLabelId) {
        doc.speakerLabelId = this.getObjectId(payload.speakerLabelId)
      }
      if (payload.collectionId) {
        doc.collectionId = this.getObjectId(payload.collectionId)
      }
      if (payload.organizationId) {
        doc.organizationId = this.getObjectId(payload.organizationId)
      }

      // User-type fields
      if (payload.userId) {
        doc.userId = payload.userId
      }

      if (payload.audioDuration !== undefined) {
        doc.audioDuration = payload.audioDuration
      }

      if (payload.embeddings) {
        doc.embeddings = payload.embeddings
      }

      if (payload.storageMode) {
        doc.storageMode = payload.storageMode
      }

      return await this.mongoInsert(doc)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getById(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // --- Label-type queries ---

  async getBySpeakerLabelId(speakerLabelId) {
    try {
      const query = {
        speakerLabelId: this.getObjectId(speakerLabelId),
      }
      return await this.mongoRequest(query, {
        sort: { created: -1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByCollectionId(collectionId) {
    try {
      const query = {
        collectionId: this.getObjectId(collectionId),
      }
      return await this.mongoRequest(query, {
        sort: { created: -1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByOrganizationId(organizationId) {
    try {
      const query = {
        organizationId: this.getObjectId(organizationId),
      }
      return await this.mongoRequest(query, {
        sort: { created: -1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // --- User-type queries ---

  async getByUserId(userId) {
    try {
      const query = {
        type: VOICE_SAMPLE_TYPE.USER,
        userId: userId,
      }
      return await this.mongoRequest(query, {
        sort: { created: -1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getAudioSamplesByUserId(userId) {
    try {
      const query = {
        type: VOICE_SAMPLE_TYPE.USER,
        userId: userId,
        format: { $ne: STORAGE_MODE.EMBEDDINGS },
      }
      return await this.mongoRequest(query, {
        sort: { created: -1 },
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getVoiceprintByUserId(userId) {
    try {
      const query = {
        type: VOICE_SAMPLE_TYPE.USER,
        userId: userId,
        format: STORAGE_MODE.EMBEDDINGS,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async upsertVoiceprint(userId, fields) {
    try {
      const allowed = {}
      if (fields.embeddings !== undefined) allowed.embeddings = fields.embeddings
      if (fields.storageMode !== undefined) allowed.storageMode = fields.storageMode

      const existing = await this.getVoiceprintByUserId(userId)
      const dateTime = moment().format()

      if (existing.length > 0) {
        await this.mongoUpdateOne(
          { _id: existing[0]._id },
          "$set",
          { ...allowed, last_update: dateTime },
        )
        return (await this.getVoiceprintByUserId(userId))[0]
      }

      const result = await this.mongoInsert({
        created: dateTime,
        last_update: dateTime,
        type: VOICE_SAMPLE_TYPE.USER,
        format: STORAGE_MODE.EMBEDDINGS,
        userId,
        ...allowed,
      })
      if (result.insertedCount === 1) {
        return (await this.getVoiceprintByUserId(userId))[0]
      }
      return null
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAudioSamplesFromUser(userId) {
    try {
      const query = {
        type: VOICE_SAMPLE_TYPE.USER,
        userId: userId,
        format: { $ne: STORAGE_MODE.EMBEDDINGS },
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllFromUser(userId) {
    try {
      const query = {
        type: VOICE_SAMPLE_TYPE.USER,
        userId: userId,
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // --- Shared ---

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

  async deleteAllFromSpeakerLabel(speakerLabelId) {
    try {
      const query = {
        speakerLabelId: this.getObjectId(speakerLabelId),
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllFromCollection(collectionId) {
    try {
      const query = {
        collectionId: this.getObjectId(collectionId),
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

module.exports = new VoiceSampleModel()
