const debug = require("debug")(
  `linto:components:MongoMigration:controllers:version:1.5.4:users`,
)
const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const collections_name = "users"

module.exports = {
  up: async (db) => {
    const usersCollection = db.collection(collections_name)

    // Fetch all users with roles other than USER
    const usersToUpdate = await usersCollection
      .find({
        role: { $exists: true, $ne: ROLE.userRole() },
      })
      .toArray()

    for (const user of usersToUpdate) {
      updatedRole = ROLE.shiftBitsUp(user.role) + ROLE.ORGANIZATION_INITIATOR

      // Update the role in the database
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { role: updatedRole } },
      )
    }
  },

  down: async (db) => {
    // No need to revert
    // const usersCollection = db.collection(collections_name)
    // // Fetch all users with roles other than USER
    // const usersToUpdate = await usersCollection
    //   .find({
    //     role: { $exists: true, $ne: ROLE.userRole() },
    //   })
    //   .toArray()
    // for (const user of usersToUpdate) {
    //   updatedRole = user.role - ROLE.ORGANIZATION_INITIATOR
    //   updatedRole = ROLE.shiftBitsUp(updatedRole)
    //   // Update the role in the database
    //   await usersCollection.updateOne(
    //     { _id: user._id },
    //     { $set: { role: updatedRole } },
    //   )
    // }
  },
}
