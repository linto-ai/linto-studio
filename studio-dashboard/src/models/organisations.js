import mongoClient from "../mongo.js"
import { ObjectId } from "mongodb"
const DB_NAME = process.env.DB_NAME

export default class Organizations {
  static async getAll(filter = {}) {
    const orgsRaw = await mongoClient
      .db(DB_NAME)
      .collection("organization")
      .find(filter)
      .toArray()

    let organizations = []
    for (let i = 0; i < orgsRaw.length; i++) {
      organizations[i] = new Organization(orgsRaw[i])
    }

    return organizations
  }

  static async getEstimatedTotal() {
    const total = await mongoClient
      .db(DB_NAME)
      .collection("organizations")
      .estimatedDocumentCount()
    return total
  }

  static async count(filter = {}) {
    const total = await mongoClient
      .db(DB_NAME)
      .collection("organizations")
      .countDocuments(filter)
    return total
  }

  static async getOneById(id) {
    const org = await mongoClient
      .db(DB_NAME)
      .collection("organization")
      .findOne({ _id: ObjectId(id) })
    if (org) return new Organization(org)
    else return null
  }
}

export class Organization {
  constructor({ _id, owner, name, users, description }) {
    this._id = _id
    this.owner = owner
    this.name = name
    this.users = users
    this.description = description
  }

  get usersId() {
    const usersId = this.users.map((user) => ObjectId(user.userId))
    return usersId
  }
}
