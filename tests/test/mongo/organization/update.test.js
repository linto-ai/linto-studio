const { MongoClient } = require('mongodb')

const mongoUtilityTest = require('../../../utility/mongo')
const randomstring = require('randomstring')

describe('update organization', () => {
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


  it('should update an organization', async () => {
    const insertedOrgaData = await organizationModel.createDefaultOrganization(id_user, mongoUtilityTest.mockUser().email)
    const id_orga = insertedOrgaData.insertedId

    const name = randomstring.generate(5)
    const orga = {
      _id : id_orga,
      name : name
    }

    let originalOrganization = await organizationDb.findOne({ _id: id_orga })
    await organizationModel.update(orga)
    let editedOrganization = await organizationDb.findOne({ _id: id_orga })
    
    expect(editedOrganization.name).toEqual(name)
    expect(originalOrganization.name).not.toBe(editedOrganization.name)
    await organizationDb.deleteOne({ _id: id_orga })
  })

})