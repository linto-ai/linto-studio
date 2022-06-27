const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')

describe('update users', () => {
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

  it('should update an user information', async () => {
    const insertedUserData = await userModel.createUser(mongoUtilityTest.mockUser())

    const id_user = insertedUserData.insertedId
    const updatedUser = {
      _id: id_user, email: 'test@mail.fr', firstname: 'first_test', lastname: 'last_test'
    }

    await userModel.update(updatedUser)
    let userEdited = await usersDb.findOne({ _id: id_user })

    expect(id_user).toEqual(userEdited._id)
    expect(updatedUser.email).toEqual(userEdited.email)
    expect(updatedUser.firstname).toEqual(userEdited.firstname)
    expect(updatedUser.lastname).toEqual(userEdited.lastname)
    await usersDb.deleteOne({ _id: id_user })
  })

  it('should generate an new password hash for the user', async () => {
    const insertedUserData = await userModel.createUser(mongoUtilityTest.mockUser())
    const id_user = insertedUserData.insertedId
    let userCreated = await usersDb.findOne({ _id: id_user })

    await userModel.updatePassword({
      _id: id_user, newPassword: 'new_psw'
    })
    let userEdited = await usersDb.findOne({ _id: id_user })

    expect(userCreated._id).toEqual(userEdited._id)
    expect(userCreated.email).toEqual(userEdited.email)
    expect(userCreated.passwordHash).not.toBe(userEdited.passwordHash)
    expect(userCreated.salt).not.toBe(userEdited.salt)

    await usersDb.deleteOne({ _id: id_user })
  })
})