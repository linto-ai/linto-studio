const debug = require('debug')('linto:conversation-manager:lib:mongodb:models:organization')
const { RIGHTS, TYPES } = require(`${process.cwd()}/lib/dao/organizations.js`)

const MongoModel = require(`../model`)

class OrganizationModel extends MongoModel {

    constructor() {
        super('organization')
    }

    // get all organizations
    async getAllOrganizations() {
        try {
            const query = {}
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // get a user by id
    async getOrganizationById(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }


    // Get a organization by name
    async getOrganizationByName(name) {
        try {
            const query = { name }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // update an organization
    async update(payload) {
        const operator = "$set"
        const query = {
            _id: this.getObjectId(payload._id)
        }
        delete payload._id
        let mutableElements = payload
        return await this.mongoUpdateOne(query, operator, mutableElements)
    }

    async create(payload) {
        try {
            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // create a personal organization
    async createPersonal(ownerId, email) {
        try {
            const payload = {
                owner : ownerId,
                name: email,
                users : [ {userId : ownerId, rights : RIGHTS.OWNER } ],
                description : 'Default user organization for ' + email,
                type: TYPES.personal
            }

            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // delete an organization
    async deleteById(id) {
        try {
            const query = {
                _id: this.getObjectId(id)
            }
            return await this.mongoDelete(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }
}

module.exports = new OrganizationModel()