const debug = require("debug")(
  `linto:components:MongoMigration:controllers:migration:index`,
)

const INIT_VERSION = "0.0.0"

const fs = require("fs")
const fsPromises = require("fs").promises
const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = {
  async migrationProcessing(db, version) {
    try {
      const availabelVersion = fs
        .readdirSync(`${process.cwd()}/components/MongoMigration/version/`)
        .sort(compareVersions)

      let desired_index = availabelVersion.indexOf(
        version.desired_version.toString(),
      )
      const current_index = availabelVersion.indexOf(
        version.current_version.toString(),
      )

      if (current_index === -1) {
        logger.error(
          "Error, current version not found " +
            version.current_version +
            ". Version range " +
            availabelVersion,
        )
        return
      }

      if (desired_index === -1) {
        const lastAvailable = availabelVersion[availabelVersion.length - 1]
        if (compareVersions(version.desired_version, lastAvailable) > 0) {
          logger.warn(
            `Desired version ${version.desired_version} not found. Migrating to latest available version ${lastAvailable}.`,
          )
          desired_index = availabelVersion.length - 1
        } else {
          logger.error(
            `Error, desired version ${version.desired_version} does not exist and falls between available versions. Cannot determine migration target. Available versions: ${availabelVersion}`,
          )
          return
        }
      }

      const version_diff = desired_index - current_index
      if (version_diff > 0) {
        // up: reset and replay all files of each new version
        for (let i = current_index + 1; i <= desired_index; i++) {
          await doMigration(availabelVersion[i], db, "up", true)
        }
      } else if (version_diff < 0) {
        for (let i = current_index; i > desired_index; i--) {
          await doMigration(availabelVersion[i], db, "down")
        }
        await resetPlayedFiles(db)
      } else {
        // same version: replay only files not played yet
        await doMigration(availabelVersion[current_index], db, "up", false)
      }
    } catch (err) {
      logger.error(err)
    }
  },

  async checkVersion(db, desired_version) {
    try {
      let current_version = desired_version

      const collectionsList = await db.listCollections().toArray()
      const versionCollection = collectionsList.filter(
        (c) => c.name === "version",
      )

      if (versionCollection.length === 0) {
        await db.createCollection("version")
        current_version = INIT_VERSION
        await db
          .collection("version")
          .insertOne({ version: INIT_VERSION, playedFiles: [] })
      } else {
        current_version = (await db.collection("version").findOne()).version
      }

      let version = {
        current_version: current_version,
        desired_version: desired_version,
      }

      return version
    } catch (err) {
      logger.error(err)
    }
  },
}

function compareVersions(a, b) {
  const partsA = a.toString().split(".").map(Number)
  const partsB = b.toString().split(".").map(Number)
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0
    const numB = partsB[i] || 0
    if (numA > numB) return 1
    if (numA < numB) return -1
  }
  return 0
}

function resetPlayedFiles(db) {
  return db.collection("version").updateMany({}, { $set: { playedFiles: [] } })
}

async function doMigration(versionStep, db, step, resetPlayed = false) {
  try {
    const migrationFiles = (
      await fsPromises.readdir(
        `${process.cwd()}/components/MongoMigration/version/${versionStep}`,
      )
    ).sort((a, b) => {
      // readdir order is filesystem-dependent. Run version.js LAST: it is the
      // only completion marker, so a crash mid-step must leave the step
      // un-stamped (it re-runs) rather than marked done before its sibling data
      // migrations applied. Other files run in a stable alphabetical order.
      if (a === "version.js") return 1
      if (b === "version.js") return -1
      return a.localeCompare(b)
    })
    if (step === "up")
      logger.info(`Migration ${step} to version ${versionStep}`)
    else logger.info(`Migration ${step} from version ${versionStep}`)

    let playedFiles = []
    if (step === "up") {
      if (resetPlayed) {
        await resetPlayedFiles(db)
      } else {
        const versionDoc = await db.collection("version").findOne()
        playedFiles = (versionDoc && versionDoc.playedFiles) || []
      }
    }

    for (let j = 0; j < migrationFiles.length; j++) {
      const file = migrationFiles[j]
      const migration = require(
        `${process.cwd()}/components/MongoMigration/version/${versionStep}/${file}`,
      )

      if (step === "up") {
        if (playedFiles.includes(file)) {
          logger.info(
            `Skipping already played migration file ${versionStep}/${file}`,
          )
          continue
        }
        await migration.up(db)
        await db
          .collection("version")
          .updateMany({}, { $addToSet: { playedFiles: file } })
      } else if (step === "down") {
        await migration.down(db)
      } else {
        logger.error("Error, step not found")
      }
    }
  } catch (err) {
    logger.error(err)
  }
}
