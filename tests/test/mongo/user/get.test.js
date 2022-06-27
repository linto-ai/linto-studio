const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')
const randomstring = require('randomstring')

describe('get users', () => {
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


  it('should get an user information by email', async () => {
    let mockUser = mongoUtilityTest.mockUser()
    mockUser.email = randomstring.generate(5) + '@unti.test'

    const insertedUserData = await userModel.createUser(mockUser)
    const id_user = insertedUserData.insertedId

    let searchedUser = await userModel.getUserByEmail(mockUser.email)

    expect(searchedUser.length).toEqual(1)
    expect(searchedUser[0].salt).toBeUndefined()
    expect(searchedUser[0].passwordHash).toBeUndefined()

    await usersDb.deleteOne({ _id: id_user })
  })

  it('should get an user token information by email', async () => {
    let mockUser = mongoUtilityTest.mockUser()
    mockUser.email = randomstring.generate(5) + '@unti.test'

    const insertedUserData = await userModel.createUser(mockUser)
    const id_user = insertedUserData.insertedId

    let searchedUser = await userModel.getUserTokenByEmail(mockUser.email)

    expect(searchedUser.length).toEqual(1)
    expect(searchedUser[0].salt).not.toBeUndefined()
    expect(searchedUser[0].passwordHash).not.toBeUndefined()
    await usersDb.deleteOne({ _id: id_user })
  })

  it('should get all user', async () => {
    const userList = await userModel.getAllUsers()
    expect(Array.isArray(userList)).toBeTruthy()
  })

  it('should get an user token information by id', async () => {
    let mockUser = mongoUtilityTest.mockUser()
    mockUser.email = randomstring.generate(5) + '@unti.test'

    const insertedUserData = await userModel.createUser(mockUser)
    const id_user = insertedUserData.insertedId

    let searchedUser = await userModel.getUserTokenById(id_user)

    //removing randomly generated data
    expect(searchedUser.length).toEqual(1)
    expect(searchedUser[0].salt).not.toBeUndefined()
    expect(searchedUser[0].passwordHash).not.toBeUndefined()
    await usersDb.deleteOne({ _id: id_user })
  })

})