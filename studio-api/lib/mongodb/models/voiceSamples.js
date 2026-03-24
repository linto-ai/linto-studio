const MongoModel = require(`../model`)
const moment = require("moment")
const {
  VOICE_SAMPLE_TYPE,
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
