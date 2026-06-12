const MongoModel = require(`../model`)
const moment = require("moment")
const {
  COLLECTION_TYPE,
  STORAGE_MODE,
  SYNC_STATE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)
const { qdrantCollectionName } = require(
  `${process.cwd()}/lib/dao/speakerIdentification/naming`,
)

class VoiceprintCollectionModel extends MongoModel {
  constructor() {
    super("voiceprintCollections")
  }

  async create(payload) {
    try {
      const dateTime = moment().format()
      const type = payload.type || COLLECTION_TYPE.CUSTOM

      // The _id is generated upfront so the Qdrant collection name can be
      // frozen at creation time (cf. docs/speaker-identification 04 §2.1)
      const _id = this.createObjectId()

      const doc = {
        _id,
        created: dateTime,
        last_update: dateTime,
        name: payload.name,
        description: payload.description || "",
        organizationId: this.getObjectId(payload.organizationId),
        type,
        // Organization-type collections have no storage mode of their own:
        // each opted-in member manages their own (04 §2.1)
        storageMode:
          type === COLLECTION_TYPE.ORGANIZATION
            ? null
            : payload.storageMode || STORAGE_MODE.AUDIO,
        qdrantCollectionName: qdrantCollectionName(
          payload.organizationId,
          _id,
        ),
        modelId: null,
        modelDim: null,
        syncState: SYNC_STATE.SYNCED,
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

  async update(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }
      const dateTime = moment().format()
      payload.last_update = dateTime

      let mutableElements = payload
      return await this.mongoUpdateOne(query, operator, mutableElements)
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

module.exports = new VoiceprintCollectionModel()
