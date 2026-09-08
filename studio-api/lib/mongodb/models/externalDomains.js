const debug = require("debug")("linto:lib:mongodb:models:externalDomains")
const MongoModel = require(`../model`)
const moment = require("moment")

/**
 * External domains of an organization: the paying / AI-transcription state of
 * an email domain, pushed by an external billing system (Twake B2B) or set once
 * by hand (Linagora internal). The identity bridge creates an API key
 * just-in-time for any email of an ACTIVE domain. One document per
 * (organizationId, domain); domains are lowercase.
 */
class ExternalDomainModel extends MongoModel {
  constructor() {
    super("externalDomains")
  }

  static isActive(doc) {
    return !!doc && doc.paying === true && doc.ai?.transcription === true
  }

  async getByOrganization(organizationId) {
    try {
      return await this.mongoRequest(
        { organizationId },
        { sort: { domain: 1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async get(organizationId, domain) {
    try {
      return await this.mongoRequest({ organizationId, domain })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /** Every organization's record for `domain`, most recently updated first. */
  async getByDomain(domain) {
    try {
      return await this.mongoRequest(
        { domain },
        { sort: { updatedAt: -1, last_update: -1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /** Idempotent upsert of the (organizationId, domain) record. */
  async upsert(organizationId, domain, payload) {
    try {
      const dateTime = moment().format()
      const { _id, organizationId: _o, domain: _d, ...values } = payload
      return await this.mongoUpdateOne(
        { organizationId, domain },
        "$set",
        { ...values, organizationId, domain, last_update: dateTime },
        { upsert: true },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async delete(organizationId, domain) {
    try {
      return await this.mongoDelete({ organizationId, domain })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllFromOrganization(organizationId) {
    try {
      return await this.mongoDeleteMany({ organizationId })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ExternalDomainModel()
