const debug = require('debug')('linto:conversation-manager:models:mongodb:models:tags')
const MongoModel = require(`../../model`)

class TagModel extends MongoModel {

    constructor() {
        super('tags') // define name of 'users' collection elsewhere?
    }

    async getByIds(idList) {
        try {
            const query = {
                "_id": {
                    $in: idList
                }
            }
            console.log(query)
            return await this.mongoRequest(query)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async getByCategory(id) {
        try {
            const query = {
                categoryId: id
            }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async searchByName(orgaId, name) {
        try {
            const query = {
                organizationId: orgaId,
                "name": {
                    $regex: name,
                    $options: 'i'
                }
            }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async searchTag(idList, orgaId, name = ".") {
        try {
            idList = idList.map(id => {
                if (typeof id === 'string') return this.getObjectId(id)
                else return
            })
            const query = {
                organizationId: orgaId,
                "_id": {
                    $in: idList
                },
                "name": {
                    $regex: name,
                    $options: 'i'
                },
            }
            return await this.mongoRequest(query)
        } catch (error) {
            console.error(error)
            return error
        }
    }
}

module.exports = new TagModel()