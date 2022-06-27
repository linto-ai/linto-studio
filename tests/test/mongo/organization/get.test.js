const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')

describe('update organization', () => {
  let organizationModel, db, connection, id_user, usersDb, organizationDb, id_orga

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

    const insertedOrgaData = await organizationModel.createDefaultOrganization(id_user, mongoUtilityTest.mockUser().email)
    id_orga = insertedOrgaData.insertedId


    usersDb = db.collection('users')
    organizationDb = db.collection('organization')
  })

  afterAll(async () => {
    await usersDb.deleteOne({ _id: id_user })
    await organizationDb.deleteOne({ _id: id_orga })

    await connection.close()
  })


  it('should get a list of organization', async () => {
    let searchedOrga = await organizationModel.getAllOrganizations()

    expect(searchedOrga.length).not.toBe(0)
    expect(searchedOrga[0].name).not.toBeUndefined()
    expect(searchedOrga[0].token).toBeUndefined()
  })

  it('should get an organization by id', async () => {
    let searchedOrga = await organizationModel.getOrganizationById(id_orga)

    expect(searchedOrga.length).not.toBe(0)
    expect(searchedOrga[0].name).toEqual(mongoUtilityTest.mockUser().email)
  })

  it('should get an organization by name', async () => {
    let searchedOrga = await organizationModel.getOrganizationByName(mongoUtilityTest.mockUser().email)

    expect(searchedOrga.length).not.toBe(0)
    expect(searchedOrga[0].name).toEqual(mongoUtilityTest.mockUser().email)
  })

  it('should get a list of personal organization', async () => {
    let searchedOrga = await organizationModel.getPersonalOrganization()

    expect(searchedOrga.length).not.toBe(0)
    expect(searchedOrga[0].name).not.toBeUndefined()
    expect(searchedOrga[0].personal).toBeTruthy()
    expect(searchedOrga[0].token).toBeUndefined()
  })
})