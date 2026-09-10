const debug = require("debug")("linto:lib:mongodb:models:externalEntitlements")
const MongoModel = require(`../model`)
const moment = require("moment")

/**
 * External entitlements: what an external system (Twake, a Meet instance…)
 * declares about the AI rights of one person or of a whole email domain.
 *
 * One document per (organizationId, provider, kind, email|domain) where
 * `organizationId` is the ROOT organization the external system writes under
 * (its own organization in Studio). `kind: "user"` records a person (B2C, or
 * an override of their domain), `kind: "domain"` records an organization of
 * that external system: it also carries `domainOrganizationId`, the Studio
 * organization created for that domain and attached to the root by
 * `metadata.parentOrganizationId`.
 *
 * `features` is a nested, extensible object (`transcription.{live,async}`,
 * `summary`, `translation`…): unknown keys are kept as they come, an absent
 * key is false. It is the ONLY place rights live — keys carry identity, not
 * rights — and it is read live on every gated call, so a revocation is
 * effective at once.
 */

const KIND_USER = "user"
const KIND_DOMAIN = "domain"

class ExternalEntitlementModel extends MongoModel {
  constructor() {
    super("externalEntitlements")
  }

  static get KIND_USER() {
    return KIND_USER
  }

  static get KIND_DOMAIN() {
    return KIND_DOMAIN
  }

  /** True when at least one leaf of the nested `features` object is true. */
  static hasActiveFeature(features) {
    if (!features || typeof features !== "object" || Array.isArray(features)) {
      return false
    }
    return Object.values(features).some((value) => {
      if (value === true) return true
      if (value && typeof value === "object") {
        return ExternalEntitlementModel.hasActiveFeature(value)
      }
      return false
    })
  }

  async getUser(organizationId, provider, email) {
    try {
      return await this.mongoRequest({
        organizationId,
        provider,
        kind: KIND_USER,
        email,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getDomain(organizationId, provider, domain) {
    try {
      return await this.mongoRequest({
        organizationId,
        provider,
        kind: KIND_DOMAIN,
        domain,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * The user records of a subject at a provider, most recently updated first.
   * A subject only means something inside its provider, so the provider is
   * part of the lookup (unlike the email one).
   */
  async findUserBySubject({ provider, subject }) {
    try {
      return await this.mongoRequest(
        { kind: KIND_USER, provider, subject },
        { sort: { updatedAt: -1, last_update: -1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Same, by the (lowercase) email, whatever the provider: the email is the
   * pivot between systems (a person declared by Twake is the same person
   * presented by a Meet instance). [P]
   */
  async findUserByEmail({ email }) {
    try {
      return await this.mongoRequest(
        { kind: KIND_USER, email },
        { sort: { updatedAt: -1, last_update: -1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /** Every root organization's record for `domain`, most recent first. [P] */
  async findDomain({ domain }) {
    try {
      return await this.mongoRequest(
        { kind: KIND_DOMAIN, domain },
        { sort: { updatedAt: -1, last_update: -1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /** Idempotent upsert of one record, keyed by its uniqueness tuple. */
  async upsert(key, payload) {
    try {
      const { _id, ...values } = payload
      return await this.mongoUpdateOne(
        key,
        "$set",
        { ...values, ...key, last_update: moment().format() },
        { upsert: true },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteOne(key) {
    try {
      return await this.mongoDelete(key)
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

module.exports = new ExternalEntitlementModel()
