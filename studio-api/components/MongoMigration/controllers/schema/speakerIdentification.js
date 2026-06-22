const debug = require("debug")(
  `linto:components:MongoMigration:controllers:schema:speakerIdentification`,
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

// Speaker-identification collections (cf. docs/speaker-identification 04-modele-de-donnees).
// Uniqueness is also enforced applicatively (409) but these indexes make it a DB
// guarantee (and back the hot lookups). Name uniqueness is case-insensitive, so the
// matching indexes carry a collation (locale en, strength 2 = case/diacritic-insensitive).
const CASE_INSENSITIVE = { locale: "en", strength: 2 }

const INDEXES = [
  // One voiceprint per subject (subjectType=user|label, subjectId hex string)
  {
    collection: "voiceprints",
    keys: { subjectType: 1, subjectId: 1 },
    options: { name: "subjectType_subjectId_unique", unique: true },
  },
  // One opt-in per (user, organization)
  {
    collection: "voiceOptIns",
    keys: { userId: 1, organizationId: 1 },
    options: { name: "userId_organizationId_unique", unique: true },
  },
  // Collection name unique per organization (case-insensitive)
  {
    collection: "voiceprintCollections",
    keys: { organizationId: 1, name: 1 },
    options: {
      name: "organizationId_name_unique_ci",
      unique: true,
      collation: CASE_INSENSITIVE,
    },
  },
  // Speaker label name unique per collection (case-insensitive)
  {
    collection: "speakerLabels",
    keys: { collectionId: 1, name: 1 },
    options: {
      name: "collectionId_name_unique_ci",
      unique: true,
      collation: CASE_INSENSITIVE,
    },
  },
]

async function createSpeakerIdentificationIndexes(db) {
  for (const { collection, keys, options } of INDEXES) {
    try {
      await db.collection(collection).createIndex(keys, options)
      debug(`Created index ${options.name} on ${collection}`)
    } catch (error) {
      // A duplicate-key failure here means pre-existing data violates the
      // constraint; log it loudly rather than crashing the migration/boot.
      logger.error(
        `Failed to create index ${options.name} on ${collection}: ${error.message}`,
      )
    }
  }
}

async function dropSpeakerIdentificationIndexes(db) {
  for (const { collection, options } of INDEXES) {
    try {
      await db.collection(collection).dropIndex(options.name)
    } catch (error) {
      // index (or collection) absent — nothing to drop
    }
  }
}

module.exports = {
  createSpeakerIdentificationIndexes,
  dropSpeakerIdentificationIndexes,
  INDEXES,
}
