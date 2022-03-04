const debug = require('debug')('linto:conversation-manager:models:mongodb:models')

const MongoDriver = require(`./driver`)

class MongoModel {

    constructor(collection) {
        this.collection = collection
    }

    getObjectId(id) {
        return MongoDriver.constructor.mongoDb.ObjectId(id)
    }

    createObjectId(id) {
        return MongoDriver.constructor.mongoDb.ObjectId()
    }

    // Request function for Mongodb. Makes a request on the collection, filtered by the query.
    async mongoRequest(query, projection) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).find(query).project(projection).toArray((error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })

            } catch (error) {
                console.error(error.toString())
                reject(error)
            }

        })
    }


    // Insert/Create ONE
    async mongoInsert(payload) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).insertOne(payload, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    //console.log('mongoInsert', result)
                    resolve({
                        status: 'success',
                        insertedId: result.insertedId
                    })
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    /**
     * Update function for mongoDB. This function will update an entry based on the "collection", the "query" and the "values" passed in parmaters.
     * @param {Object} query
     * @param {Object} values
     * @returns {Pomise}
     */
    async mongoUpdate(query, values) {
        if (values._id) {
            delete values._id
        }

        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).updateOne(query, {
                    $set: values
                }, function(error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve('success')
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    // Update ONE, define update operator param
    async mongoUpdateOne(query, operator, values, filters) {
        if (values._id) {
            delete values._id
        } // do this so we dont double the _id?
        let payload = {}
        payload[operator] = values
            //console.log('Mongo', payload)
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).updateOne(query, payload, filters, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    //console.log('MongoUpateOne', result)

                    if (!!result.result && result.result.hasOwnProperty('ok'), result.result.hasOwnProperty('nModified')) {
                        if (result.result.nModified > 0) {
                            if (result.result.ok === 1) {
                                resolve('success')
                            }
                        } else {
                            reject({
                                error: 'no_match',
                                message: 'no modification made'
                            })
                        }
                    } else {
                        reject({
                            error: 'error_getting_result',
                            message: 'Cannot access request result'
                        })
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    // Delete ONE
    async mongoDelete(query) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).deleteOne(query, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve({
                        status: 'success',
                        deletedCount: result.deletedCount
                    })
                })

            } catch (error) {
                console.error(error)
                reject(error)
            }
        })

    }

    // Aggregate
    async mongoAggregate(query) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).aggregate(query).toArray((error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })

            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

}

module.exports = MongoModel