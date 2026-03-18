const MongoModel = require(`../model`)
const moment = require("moment")

class SpeakerLabelModel extends MongoModel {
  constructor() {
    super("speakerLabels")
  }

  async create(payload) {
    try {
      const dateTime = moment().format()

      const doc = {
        created: dateTime,
        last_update: dateTime,
        name: payload.name,
        collectionId: this.getObjectId(payload.collectionId),
        organizationId: this.getObjectId(payload.organizationId),
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

  async getByCollectionIdAndName(collectionId, name) {
    try {
      const query = {
        collectionId: this.getObjectId(collectionId),
        name: name,
      }
      return await this.mongoRequest(query)
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

module.exports = new SpeakerLabelModel()
