const MongoModel = require(`../model`)
const moment = require("moment")

const KIND = require(`${process.cwd()}/lib/dao/entitlement/kinds`)
const { isDuplicateKey } = require(`../error/customErrors`)

const MOST_RECENT_FIRST = { updatedAt: -1, last_update: -1 }

class ExternalEntitlementModel extends MongoModel {
  constructor() {
    super("externalEntitlements")
  }

  async getUser(organizationId, provider, email) {
    return this.mongoRequest({
      organizationId,
      provider,
      kind: KIND.USER,
      email,
    })
  }

  async getDomain(organizationId, provider, domain) {
    return this.mongoRequest({
      organizationId,
      provider,
      kind: KIND.DOMAIN,
      domain,
    })
  }

  // Within one root: a subject only means something at its provider, an
  // email is the same person whatever the provider
  async findUser(organizationId, { provider, subject, email }) {
    const or = []
    if (subject) or.push({ provider, subject })
    if (email) or.push({ email })
    if (!organizationId || or.length === 0) return []
    return this.mongoRequest(
      { organizationId, kind: KIND.USER, $or: or },
      { sort: MOST_RECENT_FIRST },
    )
  }

  async findDomain(organizationId, domain) {
    if (!organizationId || !domain) return []
    return this.mongoRequest(
      { organizationId, kind: KIND.DOMAIN, domain },
      { sort: MOST_RECENT_FIRST },
    )
  }

  // One operation: a record with a later updatedAt matches nothing and the
  // insert attempted instead hits the unique key. False when ignored.
  async upsertUnlessNewer(key, values, onInsert = {}) {
    const filter = values.updatedAt
      ? { ...key, updatedAt: { $lte: values.updatedAt } }
      : key
    const update = {
      $set: {
        ...values,
        updatedAt: values.updatedAt || new Date(),
        last_update: moment().format(),
      },
      $setOnInsert: { ...onInsert, created: new Date() },
    }
    try {
      await this.mongoUpdateOne(filter, update, { upsert: true })
      return true
    } catch (error) {
      if (!isDuplicateKey(error)) throw error
    }
    // Two first writes raced on the insert: the record now exists, judge again
    const result = await this.mongoUpdateOne(filter, update)
    return result.matchedCount === 1
  }

  async deleteUnlessNewer(key, updatedAt) {
    const filter = updatedAt ? { ...key, updatedAt: { $lte: updatedAt } } : key
    const result = await this.mongoDelete(filter)
    return result.deletedCount === 1
  }
}

module.exports = new ExternalEntitlementModel()
