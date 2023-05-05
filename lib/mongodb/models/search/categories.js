const debug = require('debug')('linto:conversation-manager:models:mongodb:models:categories')
const MongoModel = require(`../../model`)


class CategoryModel extends MongoModel {

    constructor() {
        super('categories') // define name of 'users' collection elsewhere?
    }

    async getByOrgaIdAndName(orgaId, name) {
        try {
            const query = {
                organizationId: orgaId,
                "name": {
                    $regex: name,
                    $options: 'i'
                }
            }
            return await this.mongoRequest(query)
        } catch (err) {
            console.error(err)
            return err
        }
    }
}

module.exports = new CategoryModel()