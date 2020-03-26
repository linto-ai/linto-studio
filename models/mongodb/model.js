const MongoDriver = require(`${process.cwd()}/models/mongodb/driver`)

class MongoModel {

    constructor(collection) {
        this.collection = collection
    }

    getObjectId(id) {
        return MongoDriver.constructor.mongoDb.ObjectId(id)
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
                    resolve(result)
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    // Update ONE, define update operator param
    async mongoUpdate(query, operator, values) {
        if (values._id) {
            delete values._id
        } // do this so we dount double the _id?
        let payload = {}
        payload[operator] = values
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).updateOne(query, payload, (error, result) => {
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

    // Delete ONE
    async mongoDelete(query) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(this.collection).deleteOne(query, (error, result) => {
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