const debug = require("debug")("linto:lib:mongodb:models:organizations")
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const SECURITY_LEVELS = require(
  `${process.cwd()}/lib/dao/conversation/securityLevels`,
)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)
const COLOR = require(`${process.cwd()}/lib/dao/organization/color`)
const { regexContains } = require(`${process.cwd()}/lib/utility/escapeRegex`)

const DEFAULT_PERMISSION = require(
  `${process.cwd()}/lib/dao/organization/permissions`,
).getDefaultPermissions()
const MongoModel = require(`../model`)

const categoriesModel = require(`./categories`)
const tagsModel = require(`./tags`)

const moment = require("moment")

const public_projection = { token: 0 }

class OrganizationModel extends MongoModel {
  constructor() {
    super("organizations")
  }

  async create(payload) {
    try {
      payload.permissions = DEFAULT_PERMISSION // We don't allow user to set permissions orga permissions
      const dateTime = moment().format()
      payload.created = dateTime
      payload.last_update = dateTime
      payload.personal = false
      payload.securityLevel = SECURITY_LEVELS.getValueOrDefault(
        payload.securityLevel,
      )

      const result = await this.mongoInsert(payload)

      const { systemCategory, labelsCategory, tagsCategory } =
        await this.createOrganizationSystemCategories(
          result.insertedId.toString(),
        )

      result.categories = [systemCategory, labelsCategory, tagsCategory]

      return result
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async createOrganizationSystemCategories(organizationId) {
    try {
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
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async createDefault(userId, organizationName, oPayload) {
    try {
      let payload = {
        owner: userId,
        name: organizationName,
        users: [{ userId: userId, role: ROLES.ADMIN }],
        personal: true,
        ...oPayload,
      }
      const dateTime = moment().format()
      payload.created = dateTime
      payload.last_update = dateTime

      payload.permissions = DEFAULT_PERMISSION // We don't allow user to set permissions orga permissions
      payload.securityLevel = SECURITY_LEVELS.getValueOrDefault(
        payload.securityLevel,
      )

      const result = await this.mongoInsert(payload)

      // When a new organization is created, we create the main category "system"
      const { labelsCategory, tagsCategory } =
        await this.createOrganizationSystemCategories(
          result.insertedId.toString(),
        )

      // We add the default categories to the organization
      result.categories = [labelsCategory, tagsCategory]

      return result
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async createOrgaByAdmin(payload) {
    try {
      const dateTime = moment().format()
      payload.created = dateTime
      payload.last_update = dateTime
      payload.securityLevel = SECURITY_LEVELS.getValueOrDefault(
        payload.securityLevel,
      )
      const result = await this.mongoInsert(payload)
      return result
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // update an organization
  async updateOrgaByAdmin(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }
      if (payload.organizationId) delete payload.organizationId
      delete payload._id
      payload.last_update = moment().format()

      let mutableElements = payload
      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // get all organizations
  async getAll(filter) {
    try {
      let query = {}
      if (filter.name) {
        query.name = regexContains(filter.name)
      }
      if (filter.matchingMail) {
        query.matchingMail = regexContains(filter.matchingMail)
      }

      if (filter.hidePersonal === "true") {
        query.personal = false
      }

      if (!filter) return await this.mongoRequest(query)
      else
        return await this.mongoAggregatePaginate(
          query,
          public_projection,
          filter,
        )
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

  async getByIdAndUser(orgaId, userId, options = {}) {
    try {
      const { bypass = false } = options
      if (bypass) {
        return await this.mongoRequest(
          { _id: this.getObjectId(orgaId) },
          public_projection,
        )
      }
      const query = {
        _id: this.getObjectId(orgaId),
        users: {
          $elemMatch: {
            userId: userId.toString(),
          },
        },
      }
      return await this.mongoRequest(query, public_projection)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByName(name) {
    try {
      const query = { name }
      return await this.mongoRequest(query, public_projection)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // Resolve a user's personal/master organization (the billing subject used to
  // gate paid actions such as creating extra organizations). createDefault sets
  // {owner, personal:true} at signup; child orgs created via POST /organizations
  // are personal:false so they never match. Oldest wins for determinism.
  // Re-throws on DB error so callers can fail CLOSED (a billing gate must never
  // fail open).
  async getPersonalByOwner(userId) {
    const rows = await this.mongoRequest(
      { owner: userId.toString(), personal: true },
      public_projection,
    )
    if (!Array.isArray(rows) || rows.length === 0) return null
    rows.sort((a, b) => new Date(a.created) - new Date(b.created))
    return rows[0]
  }

  async listSelf(userId) {
    try {
      const query = {
        users: {
          $elemMatch: {
            userId: userId.toString(),
          },
        },
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
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // update an organization
  async update(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }
      if (payload.organizationId) delete payload.organizationId
      delete payload.permissions
      delete payload.securityLevel // security level is backoffice-only
      delete payload._id
      payload.last_update = moment().format()

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
}

module.exports = new OrganizationModel()
