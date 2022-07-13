const { MongoClient } = require('mongodb')

describe('Mongo connection test', () => {
  let connection
  let db

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://root:example@localhost:27017?authSource=conversations", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = await connection.db("conversations")
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should insert a doc into collection', async () => {
    const users = db.collection('users')

    const mockUser = { _id: 'test-user-id', name: 'John' }
    await users.insertOne(mockUser)

    const insertedUser = await users.findOne({ _id: 'test-user-id' })
    expect(insertedUser).toEqual(mockUser)
    await users.deleteOne({ _id: 'test-user-id' })
  })
})