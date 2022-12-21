const debug = require('debug')(`linto:components:MongoMigration:controllers:migration`)

//read all folder in version 1
const fs = require('fs')
const fsPromises = require('fs').promises

module.exports = {
  async migrationProcessing(db, version) {
    const availabelVersion = fs.readdirSync(`${process.cwd()}/components/MongoMigration/version/`)
    //check is desired version is available
    if (availabelVersion.indexOf(version.desired_version.toString()) === -1) {
      debug('Error, desired version not found ' + version.desired_version + '. Version range ' + availabelVersion)
      return
    }

    if (version.diff !== 0) {
      if (version.diff > 0) {
        for (let i = version.current_version + 1; i <= version.desired_version; i++) {
          await doMigration(i, db, 'up')
        }
      } else {
        for (let i = version.current_version; i > version.desired_version; i--) {
          await doMigration(i, db, 'down')
        }
      }
    }
  },

  async checkVersion(db, desired_version) {
    let current_version = desired_version

    const collectionsList = await db.listCollections().toArray()
    const versionCollection = collectionsList.filter(c => c.name === 'version')

    if (versionCollection.length === 0) {
      await db.createCollection('version')
      await db.collection('version').insertOne({ version: desired_version })
      current_version = 0
    } else {
      current_version = (await db.collection('version').findOne()).version
    }

    let version = {
      current_version: current_version,
      desired_version: desired_version,
      diff: desired_version - current_version
    }

    return version
  }
}

async function doMigration(versionStep, db, step) {
  try {

    const migrationFiles = await fsPromises.readdir(`${process.cwd()}/components/MongoMigration/version/${versionStep}`)

    if (step === 'up')
      debug(`Migration ${step} to version ${versionStep}`)
    else
      debug(`Migration ${step} to version ${versionStep - 1}`)


    for (let j = 0; j < migrationFiles.length; j++) {
      const file = migrationFiles[j]
      const migration = require(`${process.cwd()}/components/MongoMigration/version/${versionStep}/${file}`)

      if (step === 'up') {
        await migration.up(db)
      }
      else if (step === 'down') {
        await migration.down(db)
      }
      else {
        debug('Error, step not found')
      }
    }
  } catch (err) {
    debug(err)
  }
}