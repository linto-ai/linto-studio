#!/usr/bin/env node
/**
 * spkid-resync: rebuild the Qdrant speaker identification index from MongoDB
 * (the source of truth). Use after a Qdrant loss/migration, a naming change,
 * or a model upgrade (cf. docs/speaker-identification 07 §2.6).
 *
 * Usage (from studio-api/):
 *   node scripts/spkid-resync.js                 # every organization
 *   node scripts/spkid-resync.js --org <orgId>   # a single organization
 *   node scripts/spkid-resync.js --dry-run       # report only, no Qdrant write
 *
 * Requires ENABLE_SPEAKER_IDENTIFICATION=true and a reachable pipeline.
 */

require(`${process.cwd()}/config`)

const MongoDriver = require(`${process.cwd()}/lib/mongodb/driver`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const connector = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
)
const {
  SPEAKER_TYPE,
  speakerRef,
  displayName,
} = require(`${process.cwd()}/lib/dao/speakerIdentification/naming`)
const { COLLECTION_TYPE } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

function parseArgs(argv) {
  const args = { org: null, dryRun: false }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--org") args.org = argv[++i]
    else if (argv[i] === "--dry-run") args.dryRun = true
  }
  return args
}

async function waitForDb(timeoutMs = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (MongoDriver.constructor.db) return
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error("Timed out waiting for the MongoDB connection")
}

async function userDisplayName(userId) {
  const users = await model.users.getById(userId, true)
  return displayName(users && users[0]) || userId.toString()
}

async function resyncCollection(collection, dryRun) {
  const orgId = collection.organizationId.toString()
  const report = { collection: collection.qdrantCollectionName, upserted: 0, skipped: 0 }

  if (!dryRun) {
    await connector.dropCollection(orgId, collection.qdrantCollectionName)
  }

  if (collection.type === COLLECTION_TYPE.ORGANIZATION) {
    // Re-upsert every opted-in member that still has a computed voiceprint
    const optIns = await model.voiceOptIns.getByOrganizationId(orgId)
    for (const optIn of optIns) {
      const voiceprint = await model.voiceprints.getBySubject(
        SPEAKER_TYPE.USER,
        optIn.userId,
      )
      if (!model.voiceprints.hasComputedVoiceprint(voiceprint)) {
        report.skipped += 1
        continue
      }
      if (!dryRun) {
        await connector.upsertSpeaker(
          orgId,
          collection.qdrantCollectionName,
          speakerRef(SPEAKER_TYPE.USER, optIn.userId),
          {
            name: await userDisplayName(optIn.userId),
            vector: voiceprint.vector,
            modelId: voiceprint.modelId,
          },
        )
      }
      report.upserted += 1
    }
  } else {
    // Re-upsert every label that has a computed voiceprint
    const labels = await model.speakerLabels.getByCollectionId(collection._id)
    for (const label of labels) {
      const voiceprint = await model.voiceprints.getBySubject(
        SPEAKER_TYPE.LABEL,
        label._id,
      )
      if (!model.voiceprints.hasComputedVoiceprint(voiceprint)) {
        report.skipped += 1
        continue
      }
      if (!dryRun) {
        await connector.upsertSpeaker(
          orgId,
          collection.qdrantCollectionName,
          speakerRef(SPEAKER_TYPE.LABEL, label._id),
          {
            name: label.name,
            vector: voiceprint.vector,
            modelId: voiceprint.modelId,
          },
        )
      }
      report.upserted += 1
    }
  }
  return report
}

async function main() {
  const args = parseArgs(process.argv)
  await waitForDb()

  let collections = []
  if (args.org) {
    collections = await model.voiceprintCollections.getByOrganizationId(args.org)
  } else {
    collections = await model.voiceprintCollections.mongoRequest({})
  }
  collections = Array.isArray(collections) ? collections : []

  console.log(
    `[spkid-resync] ${collections.length} collection(s)${args.org ? ` for org ${args.org}` : ""}${args.dryRun ? " (dry-run)" : ""}`,
  )

  let totalUpserted = 0
  for (const collection of collections) {
    try {
      const report = await resyncCollection(collection, args.dryRun)
      totalUpserted += report.upserted
      console.log(
        `  ${report.collection}: ${report.upserted} upserted, ${report.skipped} skipped`,
      )
    } catch (err) {
      console.error(`  ${collection.qdrantCollectionName}: FAILED — ${err.message}`)
    }
  }
  console.log(`[spkid-resync] done: ${totalUpserted} voiceprint(s) re-upserted`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[spkid-resync] fatal:", err)
    process.exit(1)
  })
