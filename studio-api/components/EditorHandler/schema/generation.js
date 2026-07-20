// Editor schema generation. 1 = word marks (wid) in the doc; 2 = plain text,
// words/timestamps owned by the WordsState. A persisted state written with an
// older generation is migrated at load (read once with the legacy schema,
// flushed to Mongo, epoch bumped) — never replayed into a new-schema lineage.
const SCHEMA_GEN = 2

module.exports = { SCHEMA_GEN }
