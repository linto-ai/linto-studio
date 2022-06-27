const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')


describe('delete organization', () => {
  let organizationModel, db, connection, id_user, usersDb, organizationDb

  beforeAll(async () => {
    organizationModel = require(`${process.cwd()}/lib/mongodb/models/organizations`)

    connection = await MongoClient.connect(mongoUtilityTest.getMongoUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = await connection.db(process.env.DB_NAME)

    // Init a default user for organization
    const userModel = require(`${process.cwd()}/lib/mongodb/models/users`)
    const insertedUserData = await userModel.createUser(mongoUtilityTest.mockUser())
    id_user = insertedUserData.insertedId

    usersDb = db.collection('users')
    organizationDb = db.collection('organization')
  })

  afterAll(async () => {
    await usersDb.deleteOne({ _id: id_user })
    await connection.close()
  })

  it('should delete an organization', async () => {
    let mockUser = mongoUtilityTest.mockUser()
    const insertedOrgaData = await organizationModel.createDefaultOrganization(id_user, mockUser.email)
    const id_orga = insertedOrgaData.insertedId
    
    const organizationCreated = await organizationDb.findOne({ _id: id_orga })
    await organizationDb.deleteOne({ _id: id_orga })
    const organizationDeleted = await organizationDb.findOne({ _id: id_orga })

    expect(organizationCreated).not.toBe(organizationDeleted)
    expect(organizationDeleted).toEqual(null)
  })
})