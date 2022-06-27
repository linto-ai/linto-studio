const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')

describe('delete users', () => {
  let userModel, db, connection, usersDb

  beforeAll(async () => {
    userModel = require(`${process.cwd()}/lib/mongodb/models/users`)

    connection = await MongoClient.connect(mongoUtilityTest.getMongoUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = await connection.db(process.env.DB_NAME)
    usersDb = db.collection('users')
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should delete an user from collection', async () => {
    const insertedUserData = await userModel.createUser(mongoUtilityTest.mockUser())

    const id_user = insertedUserData.insertedId
    let userCreated = await usersDb.findOne({ _id: id_user })

    await usersDb.deleteOne({ _id: id_user })
    let userDeleted = await usersDb.findOne({ _id: id_user })
    expect(userCreated).not.toBe(userDeleted)
    expect(userDeleted).toEqual(null)
  })
})