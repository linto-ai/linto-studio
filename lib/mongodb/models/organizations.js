const debug = require('debug')('linto:conversation-manager:lib:mongodb:models:organization')
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

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

    async create(payload) {
        try {
            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async create(userId, organizationName, oPayload) {
        try {
            let payload = {
                owner: userId,
                name: organizationName,
                users: [{ userId: userId, role: ROLES.OWNER, visibility: 'public' }],
                type: TYPES.public,
                ...oPayload
            }

            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
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

    // get the user personal organization
    async getPersonalOrganization(userId) {
        try {
            const query = { personal: true, owner: userId }
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