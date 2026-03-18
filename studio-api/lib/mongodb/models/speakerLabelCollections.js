const MongoModel = require(`../model`)
const moment = require("moment")
const {
  COLLECTION_TYPE,
  STORAGE_MODE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

class SpeakerLabelCollectionModel extends MongoModel {
  constructor() {
    super("speakerLabelCollections")
  }

  async create(payload) {
    try {
      const dateTime = moment().format()

      const doc = {
        created: dateTime,
        last_update: dateTime,
        name: payload.name,
        description: payload.description || "",
        organizationId: this.getObjectId(payload.organizationId),
        type: payload.type || COLLECTION_TYPE.CUSTOM,
        storageMode: payload.storageMode || STORAGE_MODE.AUDIO,
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

module.exports = new SpeakerLabelCollectionModel()
