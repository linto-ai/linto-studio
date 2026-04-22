const debug = require("debug")("linto:lib:mongodb:models:users")
const MongoModel = require(`../model`)
const crypto = require("crypto")
const randomstring = require("randomstring")
const moment = require("moment")

const VALIDITY_DATE = require(
  `${process.cwd()}/lib/dao/validityDate/validityDate.js`,
)
const { escapeRegex } = require("../queryBuilders/filters")
const {
  USER_PUBLIC_PROJECTION: public_projection,
  USER_PERSONAL_PROJECTION: personal_projection,
} = require("../queryBuilders/projections")

const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

const defaultUserPayload = {
  keyToken: null,
  emailIsVerified: false,
  verifiedEmail: [],
  private: false,
  favorites: [],
  defaultOrganization: null,
  emailNotifications: {
    conversations: {
      share: { update: false, delete: false, add: true },
    },
    organizations: { update: false, delete: false, add: true },
  },
}

function generatePasswordHash(password) {
  const salt = randomstring.generate(12)
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex")
  return { salt, passwordHash }
}

function generateAuthLink() {
  return {
    magicId: randomstring.generate({
      charset: "alphanumeric",
      length: 20,
    }),
    validityDate: VALIDITY_DATE.generateValidityDate(VALIDITY_DATE.SHORT),
  }
}

class UsersModel extends MongoModel {
  constructor() {
    super("users")
  }

  async createSuperAdmin(user) {
    const { salt, passwordHash } = generatePasswordHash(user.password)
    delete user.password
    const dateTime = moment().format()

    const adminPayload = {
      ...defaultUserPayload,
      ...user,
      email: user.email,
      salt,
      passwordHash,
      authLink: generateAuthLink(),
      created: dateTime,
      last_update: dateTime,
      fromSso: false,
      type: USER_TYPE.USER,
    }

    if (!process.env.SMTP_HOST) {
      adminPayload.emailIsVerified = true
      adminPayload.verifiedEmail.push(adminPayload.email)
    }

    return await this.mongoInsert(adminPayload)
  }

  async create(payload) {
    const dateTime = moment().format()
    delete payload.password

    if (!payload.fromSso) payload.fromSso = false
    const userPayload = {
      ...payload,
      authLink: generateAuthLink(),
      ...defaultUserPayload,
      role: ROLE.defaultUserRole(),
      created: dateTime,
      last_update: dateTime,
      type: USER_TYPE.USER,
    }

    if (!process.env.SMTP_HOST) {
      userPayload.emailIsVerified = true
      userPayload.verifiedEmail.push(userPayload.email)
    }

    return await this.mongoInsert(userPayload)
  }

  async createApiKey(payload, role = ROLE.UNDEFINED) {
    const dateTime = moment().format()
    return await this.mongoInsert({
      ...payload,
      created: dateTime,
      last_update: dateTime,
      fromSso: false,
      private: true,
      role,
      type: USER_TYPE.M2M,
    })
  }

  async createUser(payload) {
    const { salt, passwordHash } = generatePasswordHash(payload.password)
    delete payload.password

    const dateTime = moment().format()
    return await this.create({
      ...payload,
      salt,
      passwordHash,
      accountNotifications: {
        updatePassword: false,
        inviteAccount: false,
      },
      created: dateTime,
      last_update: dateTime,
      fromSso: false,
    })
  }

  async createExternal(payload, fromSso = false) {
    const dateTime = moment().format()
    delete payload.password

    const externalPayload = {
      lastname: "",
      firstname: "",
      ...payload,
      img: "pictures/default.jpg",
      passwordHash: null,
      accountNotifications: {
        updatePassword: false,
        inviteAccount: true,
      },
      created: dateTime,
      last_update: dateTime,
      fromSso,
    }
    if (fromSso) {
      externalPayload.emailIsVerified = true
      externalPayload.verifiedEmail = [payload.email]
    }

    return await this.create(externalPayload)
  }

  async listPublicUsers() {
    return await this.mongoRequest(
      { private: false, emailIsVerified: true },
      public_projection,
    )
  }

  async listAllUsers(filter) {
    const query = {}

    if (filter.name) {
      query.name = { $regex: escapeRegex(filter.name), $options: "i" }
    }
    if (filter.lastname) {
      query.lastname = { $regex: escapeRegex(filter.lastname), $options: "i" }
    }
    if (filter.email) {
      query.email = { $regex: escapeRegex(filter.email), $options: "i" }
    }
    if (filter.type) {
      query.type = { $regex: escapeRegex(filter.type), $options: "i" }
    }

    if (!filter) return await this.mongoRequest(query, personal_projection)
    return await this.mongoAggregatePaginate(query, personal_projection, filter)
  }

  async listApiKey(filter = {}) {
    return await this.mongoAggregatePaginate(
      { type: USER_TYPE.M2M },
      personal_projection,
      filter,
    )
  }

  async listApiKeyList(ids, projection = {}) {
    const objectIdArray = ids.map((id) => {
      if (typeof id === "string") return this.getObjectId(id)
      else if (typeof id === "object") return id
    })
    return await this.mongoRequest(
      { _id: { $in: objectIdArray }, type: USER_TYPE.M2M },
      projection,
    )
  }

  async getPersonalInfo(id) {
    return await this.mongoRequest(
      { _id: this.getObjectId(id) },
      personal_projection,
    )
  }

  async getById(id, serverAccess = false) {
    const query = { _id: this.getObjectId(id) }
    if (serverAccess) return await this.mongoRequest(query)
    return await this.mongoRequest(query, public_projection)
  }

  async getByIdFilter(id, filter = undefined) {
    return await this.mongoRequest({ _id: this.getObjectId(id) }, { ...filter })
  }

  async getByEmail(email, serverAccess = false) {
    const query = {
      $or: [{ email }, { verifiedEmail: { $in: [email] } }],
    }
    if (serverAccess) return await this.mongoRequest(query)
    return await this.mongoRequest(query, public_projection)
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    delete payload._id
    payload.last_update = moment().format()

    if (payload.password) {
      const salt = randomstring.generate(12)
      const passwordHash = crypto
        .pbkdf2Sync(payload.password, salt, 10000, 512, "sha512")
        .toString("hex")
      delete payload.password
      payload = {
        ...payload,
        salt,
        passwordHash,
        accountNotifications: {
          updatePassword: false,
          inviteAccount: false,
        },
      }
    }
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async generateMagicLink(payload) {
    const magicId = randomstring.generate({
      charset: "alphanumeric",
      length: 20,
    })
    const validityDate = VALIDITY_DATE.generateValidityDate(VALIDITY_DATE.SHORT)

    const values = {
      authLink: { magicId, validityDate },
    }

    if (payload.accountNotifications) {
      values.accountNotifications = {
        inviteAccount: payload.accountNotifications.inviteAccount || false,
        updatePassword: payload.accountNotifications.updatePassword || false,
      }
    }

    const mongo_result = await this.mongoUpdateOne(
      { _id: this.getObjectId(payload._id) },
      "$set",
      values,
    )
    return { ...mongo_result, data: { magicId } }
  }

  async getByMagicId(magicId, serverAccess = false) {
    const query = { "authLink.magicId": magicId }
    if (serverAccess) return await this.mongoRequest(query)
    return await this.mongoRequest(query, public_projection)
  }

  // Should not be open to the REST API
  async getTokenById(id) {
    return await this.mongoRequest({ _id: this.getObjectId(id) })
  }

  async getTokenByEmail(email) {
    return await this.mongoRequest({ email })
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }

  async countSuperAdmins() {
    const result = await this.mongoRequest(
      {
        role: { $bitsAllSet: ROLE.SUPER_ADMINISTRATOR },
        type: USER_TYPE.USER,
      },
      { _id: 1 },
    )
    return result.length
  }

  async deleteMany(ids) {
    const objectIdArray = ids.map((id) => {
      if (typeof id === "string") return this.getObjectId(id)
      else if (typeof id === "object") return id
    })
    return await this.mongoDeleteMany({ _id: { $in: objectIdArray } })
  }
}

module.exports = new UsersModel()
