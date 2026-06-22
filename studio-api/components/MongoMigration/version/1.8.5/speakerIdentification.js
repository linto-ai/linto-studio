// Migration 1.8.6 — speaker identification schema.
//
// The speaker-id collections (voiceprints, voiceOptIns, voiceprintCollections,
// speakerLabels) are created lazily by Mongo on first write; this migration only
// installs the unique indexes the data model requires (docs/speaker-identification
// 04-modele-de-donnees). `down` drops only those indexes — it does NOT drop the
// collections, which hold consented user voice data (PII).
const {
  createSpeakerIdentificationIndexes,
  dropSpeakerIdentificationIndexes,
} = require(
  `${process.cwd()}/components/MongoMigration/controllers/schema/speakerIdentification`,
)

module.exports = {
  async up(db) {
    await createSpeakerIdentificationIndexes(db)
  },

  async down(db) {
    await dropSpeakerIdentificationIndexes(db)
  },
}
