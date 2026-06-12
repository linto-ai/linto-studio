const MongoModel = require(`../model`)
const moment = require("moment")

class VoiceOptInModel extends MongoModel {
  constructor() {
    super("voiceOptIns")
  }

  async setOptIn(userId, organizationId) {
    try {
      const query = {
        userId,
        organizationId: this.getObjectId(organizationId),
      }
      const values = {
        userId,
        organizationId: this.getObjectId(organizationId),
        created: moment().format(),
      }
      await this.mongoUpdateOne(query, "$setOnInsert", values, { upsert: true })
      // consentVersion tracks the consent text version the user validated;
      // re-opting-in refreshes it (cf. docs/speaker-identification 04 §2.5)
      await this.mongoUpdateOne(query, "$set", {
        consentVersion: process.env.SPEAKER_ID_CONSENT_VERSION || "1",
      })
      const result = await this.getByUserAndOrg(userId, organizationId)
      return result[0] || null
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async removeOptIn(userId, organizationId) {
    try {
      const query = {
        userId,
        organizationId: this.getObjectId(organizationId),
      }
      return await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByUserAndOrg(userId, organizationId) {
    try {
      const query = {
        userId,
        organizationId: this.getObjectId(organizationId),
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByUserId(userId) {
    try {
      const query = { userId }
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
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllFromUser(userId) {
    try {
      const query = { userId }
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

module.exports = new VoiceOptInModel()
