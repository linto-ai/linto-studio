const debug = require("debug")("linto:lib:mongodb:models:organizations")
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)
const COLOR = require(`${process.cwd()}/lib/dao/organization/color`)

const DEFAULT_PERMISSION = require(
  `${process.cwd()}/lib/dao/organization/permissions`,
).getDefaultPermissions()
const MongoModel = require(`../model`)

const categoriesModel = require(`./categories`)
const tagsModel = require(`./tags`)
const { escapeRegex } = require("../queryBuilders/filters")
const {
  ORGANIZATION_PUBLIC_PROJECTION: public_projection,
} = require("../queryBuilders/projections")

const moment = require("moment")

class OrganizationModel extends MongoModel {
  constructor() {
    super("organizations")
  }

  async create(payload) {
    payload.permissions = DEFAULT_PERMISSION
    const dateTime = moment().format()
    payload.created = dateTime
    payload.last_update = dateTime
    payload.personal = false

    const result = await this.mongoInsert(payload)

    const { systemCategory, labelsCategory, tagsCategory } =
      await this.createOrganizationSystemCategories(
        result.insertedId.toString(),
      )

    result.categories = [systemCategory, labelsCategory, tagsCategory]
    return result
  }

  async createOrganizationSystemCategories(organizationId) {
    const labelsCategory = await categoriesModel.create({
      color: COLOR.getRandomColor(),
      name: "labels",
      scopeId: organizationId,
      type: TYPE.SYSTEM,
    })
    const tagsCategory = await categoriesModel.create({
      color: COLOR.getRandomColor(),
      name: "tags",
      scopeId: organizationId,
      type: TYPE.SYSTEM,
    })
    await tagsModel.createDefaultTags(organizationId, tagsCategory.insertedId)
    return { labelsCategory, tagsCategory }
  }

  async createDefault(userId, organizationName, oPayload) {
    const dateTime = moment().format()
    const payload = {
      owner: userId,
      name: organizationName,
      users: [{ userId, role: ROLES.ADMIN }],
      personal: true,
      ...oPayload,
      created: dateTime,
      last_update: dateTime,
      permissions: DEFAULT_PERMISSION,
    }

    const result = await this.mongoInsert(payload)

    const { labelsCategory, tagsCategory } =
      await this.createOrganizationSystemCategories(
        result.insertedId.toString(),
      )

    result.categories = [labelsCategory, tagsCategory]
    return result
  }

  async createOrgaByAdmin(payload) {
    const dateTime = moment().format()
    payload.created = dateTime
    payload.last_update = dateTime
    return await this.mongoInsert(payload)
  }

  async updateOrgaByAdmin(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    if (payload.organizationId) delete payload.organizationId
    delete payload._id
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async getAll(filter) {
    const query = {}
    if (filter.name) {
      query.name = { $regex: escapeRegex(filter.name), $options: "i" }
    }
    if (filter.matchingMail) {
      query.matchingMail = {
        $regex: escapeRegex(filter.matchingMail),
        $options: "i",
      }
    }
    if (filter.hidePersonal === "true") {
      query.personal = false
    }

    if (!filter) return await this.mongoRequest(query)
    return await this.mongoAggregatePaginate(query, public_projection, filter)
  }

  async getById(id) {
    return await this.mongoRequest({ _id: this.getObjectId(id) })
  }

  async getByIdAndUser(orgaId, userId) {
    return await this.mongoRequest(
      {
        _id: this.getObjectId(orgaId),
        users: { $elemMatch: { userId: userId.toString() } },
      },
      public_projection,
    )
  }

  async getByName(name) {
    return await this.mongoRequest({ name }, public_projection)
  }

  async listSelf(userId) {
    const query = {
      users: { $elemMatch: { userId: userId.toString() } },
    }
    const organizations = await this.mongoRequest(query, public_projection)

    if (organizations.length === 0) return organizations

    const orgIds = organizations.map((o) => o._id.toString())
    const allCategories =
      await categoriesModel.getSystemCategoriesByOrgIds(orgIds)

    const categoriesByOrg = new Map()
    for (const cat of allCategories) {
      const key = cat.scopeId
      if (!categoriesByOrg.has(key)) categoriesByOrg.set(key, [])
      categoriesByOrg.get(key).push(cat)
    }

    for (const organization of organizations) {
      organization.categories =
        categoriesByOrg.get(organization._id.toString()) || []
    }

    return organizations
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    if (payload.organizationId) delete payload.organizationId
    delete payload.permissions
    delete payload._id
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }
}

module.exports = new OrganizationModel()
