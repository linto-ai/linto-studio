const debug = require('debug')('linto:conversation-manager:lib:mongodb:models:organization')
const ROLES = require(`${process.cwd()}/lib/dao/roles/organization.js`)

const MongoModel = require(`../model`)

const TYPES = {
    public: 'public',
    private: 'private',
    asType: type => (type in TYPES)
}

class OrganizationModel extends MongoModel {

    constructor() {
        super('organization')
    }

    getTypes() {
        return TYPES
    }

    // get all organizations
    async getAllOrganizations() {
        try {
            const query = {}
            const projetion = { token: 0 }
            return await this.mongoRequest(query, projetion)
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


    async getPersonalOrganization() {
        try {
            const query = { personal: true }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

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
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload._id)
            }

            if (payload.organizationId)
                delete payload.organizationId

            delete payload._id
            let mutableElements = payload
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async create(ownerId, payload) {
        try {
            payload.users.push({ userId: ownerId, role: ROLES.OWNER, visibility: TYPES.public })
            payload.owner = ownerId
            payload.personal = false

            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async createDefaultOrganization(ownerId, email) {
        try {
            const payload = {
                owner: ownerId,
                name: email,
                users: [{ userId: ownerId, role: ROLES.OWNER, visibility: 'public' }],
                description: 'Default user organization for ' + email,
                type: TYPES.public,
                personal: true
            }

            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

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