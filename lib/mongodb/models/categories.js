const debug = require('debug')('linto:conversation-manager:models:mongodb:models:categories')
const MongoModel = require(`../model`)


class CategoryModel extends MongoModel {

    constructor() {
        super('categories') // define name of 'users' collection elsewhere?
    }

    async create(payload) {
        try {
            return await this.mongoInsert(payload)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getById(id) {
        try {
            let query = {
                _id: this.getObjectId(id)
            }

            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async getByOrgaId(id, querySearch) {
        try {
            let query = {
                organizationId: id
            }
            if (querySearch) {
                query = {
                    ...query,
                    ...querySearch
                }
            }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async update(payload) {
        try {
            const operator = "$set"
            const query = {
                _id: this.getObjectId(payload._id)
            }
            let mutableElements = payload
            return await this.mongoUpdateOne(query, operator, mutableElements)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // delete a user
    async delete(id) {
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

module.exports = new CategoryModel()