const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')

describe('insert users', () => {
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

  it('should create an user into collection', async () => {
    let mockUser = mongoUtilityTest.mockUser()

    const insertedUserData = await userModel.createUser(mockUser)
    const id_user = insertedUserData.insertedId
    let userCreated = await usersDb.findOne({ _id: id_user })

    //removing randomly generated data
    delete mockUser.password
    delete userCreated.passwordHash
    delete userCreated.salt
    delete userCreated._id

    expect(userCreated).toEqual(mockUser)
    await usersDb.deleteOne({ _id: id_user })
  })
})