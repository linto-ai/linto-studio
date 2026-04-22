const debug = require("debug")("linto:lib:mongodb:models:categories")
const MongoModel = require(`../model`)

const moment = require("moment")
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)
const { escapeRegex } = require("../queryBuilders/filters")

class CategoryModel extends MongoModel {
  constructor() {
    super("categories")
  }

  async createDefaultCategories(name, scopeId) {
    return await this.create({
      name,
      scope: "nlp-" + name,
      scopeId,
      type: TYPE.HIGHLIGHT,
      color: "deep-purple",
    })
  }

  async create(payload) {
    const dateTime = moment().format()
    payload.created = dateTime
    payload.last_update = dateTime
    return await this.mongoInsert(payload)
  }

  async getById(id) {
    return await this.mongoRequest({ _id: this.getObjectId(id) })
  }

  async getSystemCategories(organizationId = undefined) {
    const query = { type: TYPE.SYSTEM }
    if (organizationId) {
      query.scopeId = organizationId
    }
    return await this.mongoRequest(query)
  }

  async getSystemCategoriesByOrgIds(orgIds) {
    return await this.mongoRequest({
      type: TYPE.SYSTEM,
      scopeId: { $in: orgIds },
    })
  }

  async getByOrganizationId(organizationId) {
    return await this.mongoRequest({ organizationId })
  }

  async getByScope(id) {
    return await this.mongoRequest({ scopeId: id })
  }

  async searchByScopeAndName(scopeId, name) {
    return await this.mongoRequest({
      scopeId,
      name: { $regex: escapeRegex(name), $options: "i" },
    })
  }

  async getByScopeAndName(scopeId, name, type = undefined) {
    const query = { scopeId, name }
    if (type) query.type = type
    return await this.mongoRequest(query)
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }
}

module.exports = new CategoryModel()
