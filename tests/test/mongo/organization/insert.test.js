const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')
const ROLES = require(`${process.cwd()}/lib/dao/roles/organization.js`)
const TYPES = {
    public: 'public',
    private: 'private'
}


describe('insert organization', () => {
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

  it('should create a default user organization collection', async () => {
    let mockUser = mongoUtilityTest.mockUser()
    const insertedOrgaData = await organizationModel.createDefaultOrganization(id_user, mockUser.email)
    const id_orga = insertedOrgaData.insertedId

    const organizationCreated = await organizationDb.findOne({ _id: id_orga })

    expect(organizationCreated.owner).toEqual(id_user)
    expect(organizationCreated.name).toEqual(mockUser.email)
    expect(organizationCreated.users.length).toEqual(1)
    expect(organizationCreated.users[0]).toEqual({ userId: id_user, role: ROLES.OWNER, visibility: 'public' })
    expect(organizationCreated.description).toEqual('Default user organization for ' + mockUser.email)
    expect(organizationCreated.type).toEqual(TYPES.public)
    expect(organizationCreated.personal).toEqual(true)

    await organizationDb.deleteOne({ _id: id_orga })
  })

  it('should create an organization with one user', async () => {
    let mockOrga = mongoUtilityTest.mockOrganization()
    const insertedOrgaData = await organizationModel.create(id_user, mockOrga)
    const id_orga = insertedOrgaData.insertedId
    const organizationCreated = await organizationDb.findOne({ _id: id_orga })

    expect(organizationCreated.owner).toEqual(id_user)
    expect(organizationCreated.name).toEqual(mockOrga.name)
    expect(organizationCreated.users.length).toEqual(1)
    expect(organizationCreated.users[0]).toEqual({ userId: id_user, role: ROLES.OWNER, visibility: 'public' })
    expect(organizationCreated.type).toEqual(TYPES.public)
    expect(organizationCreated.personal).toEqual(false)

    await organizationDb.deleteOne({ _id: id_orga })
  })

  it('should create an organization with multiple user', async () => {
    let mockOrga = mongoUtilityTest.mockOrganization()
    mockOrga.users.push({ userId: '62ac58e0f89def5e002f17ba', role: ROLES.ADMIN, visibility: 'private' })
    mockOrga.users.push({ userId: '62ac58e0f89def5e002f17bb', role: ROLES.MEMBER, visibility: 'private' })

    const insertedOrgaData = await organizationModel.create(id_user, mockOrga)
    const id_orga = insertedOrgaData.insertedId
    const organizationCreated = await organizationDb.findOne({ _id: insertedOrgaData.insertedId })

    expect(organizationCreated._id).toEqual(id_orga)
    expect(organizationCreated.owner).toEqual(id_user)
    expect(organizationCreated.name).toEqual(mockOrga.name)
    expect(organizationCreated.users.length).toEqual(3)
    expect(organizationCreated.type).toEqual(TYPES.public)
    expect(organizationCreated.personal).toEqual(false)

    await organizationDb.deleteOne({ _id: id_orga })
  })
})