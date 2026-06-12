/**
 * Speaker identification triggers: orchestration between Studio data (Mongo +
 * audio files) and the Qdrant index, through the connector. Controllers call
 * these (fire-and-forget) after their Mongo writes; every function is
 * defensive and never throws back to the request handler.
 *
 * Mongo is the source of truth (cf. docs/speaker-identification 03 D1): on a
 * Qdrant write failure the operation is queued in `speakerIdSyncOps` and the
 * relevant syncState is set to "pending" (07 §2.3, 04 §6-7).
 */

const debug = require("debug")(
  "linto:components:WebServer:controllers:speakerIdentification:triggers",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const connector = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/connector`,
)
const {
  resolveStoragePath,
  cascadeDeleteSampleFiles,
  COLLECTION_TYPE,
  STORAGE_MODE,
  SYNC_STATE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)
const {
  SPEAKER_TYPE,
  speakerRef,
  displayName,
} = require(`${process.cwd()}/lib/dao/speakerIdentification/naming`)

const SYNC_OP = model.speakerIdSyncOps.SYNC_OP

function enabled() {
  return process.env.ENABLE_SPEAKER_IDENTIFICATION === "true"
}

// --- sample file resolution ------------------------------------------------

function sampleAbsolutePaths(samples) {
  const paths = []
  for (const s of samples) {
    if (!s.audioFilePath) continue
    const abs = resolveStoragePath(s.audioFilePath)
    if (abs) paths.push(abs)
  }
  return paths
}

// --- Qdrant write helpers (enqueue on failure) -----------------------------

async function pushSpeaker(
  organizationId,
  qdrantCollection,
  ref,
  name,
  vector,
  modelId,
  voiceprintId,
) {
  try {
    await connector.upsertSpeaker(organizationId, qdrantCollection, ref, {
      name,
      vector,
      modelId,
    })
    return SYNC_STATE.SYNCED
  } catch (err) {
    debug("upsertSpeaker failed (%s), queuing: %s", ref, err.message)
    await model.speakerIdSyncOps.enqueue({
      op: SYNC_OP.UPSERT,
      qdrantCollectionName: qdrantCollection,
      organizationId,
      pointId: ref,
      voiceprintId: voiceprintId || null,
    })
    return SYNC_STATE.PENDING
  }
}

async function removeSpeaker(organizationId, qdrantCollection, ref) {
  try {
    await connector.deleteSpeaker(organizationId, qdrantCollection, ref)
    return SYNC_STATE.SYNCED
  } catch (err) {
    debug("deleteSpeaker failed (%s), queuing: %s", ref, err.message)
    await model.speakerIdSyncOps.enqueue({
      op: SYNC_OP.DELETE_SPEAKER,
      qdrantCollectionName: qdrantCollection,
      organizationId,
      pointId: ref,
    })
    return SYNC_STATE.PENDING
  }
}

async function dropQdrantCollection(organizationId, qdrantCollection) {
  try {
    await connector.dropCollection(organizationId, qdrantCollection)
    return SYNC_STATE.SYNCED
  } catch (err) {
    debug("dropCollection failed (%s), queuing: %s", qdrantCollection, err.message)
    await model.speakerIdSyncOps.enqueue({
      op: SYNC_OP.DROP_COLLECTION,
      qdrantCollectionName: qdrantCollection,
      organizationId,
    })
    return SYNC_STATE.PENDING
  }
}

// --- state setters ---------------------------------------------------------

async function setLabelState(labelId, syncState, hasVoiceprint) {
  const patch = { _id: labelId.toString(), syncState }
  if (hasVoiceprint !== undefined) patch.hasVoiceprint = hasVoiceprint
  await model.speakerLabels.update(patch)
}

async function setCollectionState(collection, syncState, modelId, modelDim) {
  const patch = { _id: collection._id.toString(), syncState }
  if (modelId !== undefined && !collection.modelId) patch.modelId = modelId
  if (modelDim !== undefined && !collection.modelDim) patch.modelDim = modelDim
  await model.voiceprintCollections.update(patch)
}

// --- label triggers --------------------------------------------------------

/**
 * Recompute a label voiceprint from its samples and upsert it into the
 * collection's Qdrant collection. Fire-and-forget.
 */
async function recomputeLabel(label) {
  if (!enabled()) return
  try {
    const collections = await model.voiceprintCollections.getById(
      label.collectionId,
    )
    if (!collections || collections.length === 0) return
    const collection = collections[0]

    const samples = await model.voiceSamples.getBySpeakerLabelId(label._id)
    const filePaths = sampleAbsolutePaths(samples)

    if (filePaths.length === 0) {
      // No audio available: keep any existing voiceprint untouched (one-way
      // semantics, 04 §6a). Nothing to recompute.
      return
    }

    const result = await connector.computeVoiceprint(
      label.organizationId.toString(),
      filePaths,
    )

    const voiceprint = await model.voiceprints.upsert(
      SPEAKER_TYPE.LABEL,
      label._id,
      {
        vector: result.vector,
        modelId: result.modelId,
        dim: result.dim,
        computedAt: new Date().toISOString(),
        sourceSampleIds: samples.map((s) => s._id),
        sourceDuration: result.durationUsed,
      },
    )

    const state = await pushSpeaker(
      label.organizationId.toString(),
      collection.qdrantCollectionName,
      speakerRef(SPEAKER_TYPE.LABEL, label._id),
      label.name,
      result.vector,
      result.modelId,
      voiceprint && voiceprint._id,
    )

    await setLabelState(label._id, state, true)
    await setCollectionState(collection, state, result.modelId, result.dim)

    // Embeddings-only collection: drop the audio once the voiceprint exists
    if (collection.storageMode === STORAGE_MODE.EMBEDDINGS) {
      cascadeDeleteSampleFiles(samples)
      await model.voiceSamples.deleteAllFromSpeakerLabel(label._id)
    }
  } catch (err) {
    debug("recomputeLabel failed for %s: %s", label._id, err.message)
    try {
      await setLabelState(label._id, SYNC_STATE.ERROR)
    } catch (e) {
      debug("setLabelState(error) failed: %s", e.message)
    }
  }
}

/** Re-upsert a label point with a new name (vector unchanged). */
async function renameLabelSpeaker(label) {
  if (!enabled()) return
  try {
    const voiceprint = await model.voiceprints.getBySubject(
      SPEAKER_TYPE.LABEL,
      label._id,
    )
    if (!model.voiceprints.hasComputedVoiceprint(voiceprint)) return
    const collections = await model.voiceprintCollections.getById(
      label.collectionId,
    )
    if (!collections || collections.length === 0) return
    const state = await pushSpeaker(
      label.organizationId.toString(),
      collections[0].qdrantCollectionName,
      speakerRef(SPEAKER_TYPE.LABEL, label._id),
      label.name,
      voiceprint.vector,
      voiceprint.modelId,
      voiceprint._id,
    )
    await setLabelState(label._id, state)
  } catch (err) {
    debug("renameLabelSpeaker failed for %s: %s", label._id, err.message)
  }
}

/** Delete a label point and its voiceprint (label deletion). */
async function deleteLabelSpeaker(label, qdrantCollectionName) {
  if (!enabled()) return
  try {
    await model.voiceprints.deleteBySubject(SPEAKER_TYPE.LABEL, label._id)
    let collectionName = qdrantCollectionName
    if (!collectionName) {
      const collections = await model.voiceprintCollections.getById(
        label.collectionId,
      )
      if (!collections || collections.length === 0) return
      collectionName = collections[0].qdrantCollectionName
    }
    await removeSpeaker(
      label.organizationId.toString(),
      collectionName,
      speakerRef(SPEAKER_TYPE.LABEL, label._id),
    )
  } catch (err) {
    debug("deleteLabelSpeaker failed for %s: %s", label._id, err.message)
  }
}

/** Delete only the voiceprint of a label (keep the label). */
async function deleteLabelVoiceprint(label) {
  if (!enabled()) return
  await deleteLabelSpeaker(label)
  try {
    await setLabelState(label._id, SYNC_STATE.SYNCED, false)
  } catch (err) {
    debug("deleteLabelVoiceprint state update failed: %s", err.message)
  }
}

// --- collection / organization triggers ------------------------------------

/** Drop the Qdrant collection of a deleted Studio collection. */
async function dropCollectionSpeakers(collection) {
  if (!enabled()) return
  try {
    const labels = await model.speakerLabels.getByCollectionId(collection._id)
    await model.voiceprints.deleteBySubjectIds(
      SPEAKER_TYPE.LABEL,
      labels.map((l) => l._id.toString()),
    )
    await dropQdrantCollection(
      collection.organizationId.toString(),
      collection.qdrantCollectionName,
    )
  } catch (err) {
    debug("dropCollectionSpeakers failed for %s: %s", collection._id, err.message)
  }
}

/** Drop every Qdrant collection of an organization (org deletion). */
async function dropOrganizationSpeakers(organizationId, collections, labels) {
  if (!enabled()) return
  try {
    if (Array.isArray(labels) && labels.length > 0) {
      await model.voiceprints.deleteBySubjectIds(
        SPEAKER_TYPE.LABEL,
        labels.map((l) => l._id.toString()),
      )
    }
    for (const collection of collections || []) {
      if (collection.qdrantCollectionName) {
        await dropQdrantCollection(
          organizationId.toString(),
          collection.qdrantCollectionName,
        )
      }
    }
  } catch (err) {
    debug("dropOrganizationSpeakers failed for %s: %s", organizationId, err.message)
  }
}

// --- user triggers ---------------------------------------------------------

async function userDisplayName(userId) {
  const users = await model.users.getById(userId, true)
  return displayName(users && users[0]) || userId.toString()
}

/**
 * Recompute the user voiceprint from their samples and re-upsert it into the
 * Organization collection of every opted-in organization. Fire-and-forget.
 */
async function recomputeUser(userId) {
  if (!enabled()) return
  try {
    const samples = await model.voiceSamples.getByUserId(userId)
    const filePaths = sampleAbsolutePaths(samples)
    if (filePaths.length === 0) return

    const existing = await model.voiceprints.getBySubject(
      SPEAKER_TYPE.USER,
      userId,
    )
    const storageMode = model.voiceprints.getStorageMode(existing)

    const optIns = await model.voiceOptIns.getByUserId(userId)
    // Compute needs an organization only for the request header (the worker
    // ignores it; isolation is per-collection). Prefer an opted-in org, else
    // fall back to any org the user belongs to so the voiceprint is computed
    // eagerly when samples change (US-U2), even before any opt-in.
    let computeOrgId =
      optIns.length > 0 ? optIns[0].organizationId.toString() : null
    if (!computeOrgId) {
      const orgs = await model.organizations.listSelf(userId)
      computeOrgId = orgs.length > 0 ? orgs[0]._id.toString() : null
    }
    if (!computeOrgId) {
      // The user belongs to no organization at all: cannot compute.
      return
    }

    const result = await connector.computeVoiceprint(computeOrgId, filePaths)

    const voiceprint = await model.voiceprints.upsert(SPEAKER_TYPE.USER, userId, {
      vector: result.vector,
      modelId: result.modelId,
      dim: result.dim,
      computedAt: new Date().toISOString(),
      sourceSampleIds: samples.map((s) => s._id),
      sourceDuration: result.durationUsed,
      storageMode,
    })

    const name = await userDisplayName(userId)
    let aggregateState = SYNC_STATE.SYNCED
    for (const optIn of optIns) {
      const orgId = optIn.organizationId.toString()
      const orgCollection =
        await model.voiceprintCollections.getOrCreateOrganizationCollection(orgId)
      if (!orgCollection) continue
      const state = await pushSpeaker(
        orgId,
        orgCollection.qdrantCollectionName,
        speakerRef(SPEAKER_TYPE.USER, userId),
        name,
        result.vector,
        result.modelId,
        voiceprint && voiceprint._id,
      )
      if (state !== SYNC_STATE.SYNCED) aggregateState = state
    }

    await model.voiceprints.upsert(SPEAKER_TYPE.USER, userId, {
      syncState: aggregateState,
    })

    if (storageMode === STORAGE_MODE.EMBEDDINGS) {
      cascadeDeleteSampleFiles(samples)
      await model.voiceSamples.deleteAllFromUser(userId)
    }
  } catch (err) {
    debug("recomputeUser failed for %s: %s", userId, err.message)
    try {
      await model.voiceprints.upsert(SPEAKER_TYPE.USER, userId, {
        syncState: SYNC_STATE.ERROR,
      })
    } catch (e) {
      debug("recomputeUser error-state update failed: %s", e.message)
    }
  }
}

/** Opt-in: ensure the user voiceprint is present in this org's collection. */
async function upsertUserInOrg(userId, organizationId) {
  if (!enabled()) return
  try {
    const voiceprint = await model.voiceprints.getBySubject(
      SPEAKER_TYPE.USER,
      userId,
    )
    if (!model.voiceprints.hasComputedVoiceprint(voiceprint)) {
      // No voiceprint yet: compute from samples (covers every opted-in org)
      await recomputeUser(userId)
      return
    }
    const orgCollection =
      await model.voiceprintCollections.getOrCreateOrganizationCollection(
        organizationId,
      )
    if (!orgCollection) return
    const name = await userDisplayName(userId)
    await pushSpeaker(
      organizationId.toString(),
      orgCollection.qdrantCollectionName,
      speakerRef(SPEAKER_TYPE.USER, userId),
      name,
      voiceprint.vector,
      voiceprint.modelId,
      voiceprint._id,
    )
  } catch (err) {
    debug("upsertUserInOrg failed for %s/%s: %s", userId, organizationId, err.message)
  }
}

/** Opt-out: remove the user voiceprint from this org's collection. */
async function removeUserFromOrg(userId, organizationId) {
  if (!enabled()) return
  try {
    const orgCollection =
      await model.voiceprintCollections.getOrCreateOrganizationCollection(
        organizationId,
      )
    if (!orgCollection) return
    await removeSpeaker(
      organizationId.toString(),
      orgCollection.qdrantCollectionName,
      speakerRef(SPEAKER_TYPE.USER, userId),
    )
  } catch (err) {
    debug("removeUserFromOrg failed for %s/%s: %s", userId, organizationId, err.message)
  }
}

/** Remove the user voiceprint from a set of organizations (delete-all/account). */
async function removeUserEverywhere(userId, optInDocs) {
  if (!enabled()) return
  for (const optIn of optInDocs || []) {
    await removeUserFromOrg(userId, optIn.organizationId.toString())
  }
}

/** Re-upsert the user point with a new display name in every opted-in org. */
async function renameUserSpeaker(userId) {
  if (!enabled()) return
  try {
    const voiceprint = await model.voiceprints.getBySubject(
      SPEAKER_TYPE.USER,
      userId,
    )
    if (!model.voiceprints.hasComputedVoiceprint(voiceprint)) return
    const optIns = await model.voiceOptIns.getByUserId(userId)
    if (optIns.length === 0) return
    const name = await userDisplayName(userId)
    for (const optIn of optIns) {
      const orgId = optIn.organizationId.toString()
      const orgCollection =
        await model.voiceprintCollections.getOrCreateOrganizationCollection(orgId)
      if (!orgCollection) continue
      await pushSpeaker(
        orgId,
        orgCollection.qdrantCollectionName,
        speakerRef(SPEAKER_TYPE.USER, userId),
        name,
        voiceprint.vector,
        voiceprint.modelId,
        voiceprint._id,
      )
    }
  } catch (err) {
    debug("renameUserSpeaker failed for %s: %s", userId, err.message)
  }
}

module.exports = {
  enabled,
  recomputeLabel,
  renameLabelSpeaker,
  deleteLabelSpeaker,
  deleteLabelVoiceprint,
  dropCollectionSpeakers,
  dropOrganizationSpeakers,
  recomputeUser,
  upsertUserInOrg,
  removeUserFromOrg,
  removeUserEverywhere,
  renameUserSpeaker,
  // exported for the reconciliation worker
  pushSpeaker,
  removeSpeaker,
  dropQdrantCollection,
}
