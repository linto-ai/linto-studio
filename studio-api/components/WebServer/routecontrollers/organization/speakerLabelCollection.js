const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  cascadeDeleteSignatureFiles,
  COLLECTION_TYPE,
  STORAGE_MODE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  SpeakerLabelCollectionError,
  SpeakerLabelCollectionNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerDiarization`,
)

const MAX_NAME_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 1000

function sanitizeName(name) {
  if (!name || typeof name !== "string") return null
  const trimmed = name.trim()
  return trimmed.length > 0 && trimmed.length <= MAX_NAME_LENGTH
    ? trimmed
    : null
}

function sanitizeDescription(description) {
  if (!description || typeof description !== "string") return ""
  return description.trim().slice(0, MAX_DESCRIPTION_LENGTH)
}

/**
 * Verify a resource belongs to the expected organization.
 * Works for any model entity that has an organizationId field.
 */
async function verifyOwnership(modelRef, id, organizationId, NotFoundError) {
  const result = await modelRef.getById(id)
  if (result.length === 0) throw new NotFoundError()
  if (result[0].organizationId.toString() !== organizationId) {
    throw new NotFoundError()
  }
  return result[0]
}

async function ensureOrganizationCollection(organizationId) {
  const all = await model.speakerLabelCollections.getByOrganizationId(organizationId)
  const hasOrgCollection = all.some(
    (c) => c.type === COLLECTION_TYPE.ORGANIZATION,
  )
  if (!hasOrgCollection) {
    const result = await model.speakerLabelCollections.create({
      name: "Organization",
      description: "",
      organizationId,
      type: COLLECTION_TYPE.ORGANIZATION,
      storageMode: STORAGE_MODE.AUDIO,
    })
    if (result.insertedCount === 1) {
      const created = await model.speakerLabelCollections.getById(
        result.insertedId.toString(),
      )
      all.push(created[0])
    }
  }
  return all
}

async function getSpeakerLabelCollections(req, res, next) {
  try {
    const collections = await ensureOrganizationCollection(
      req.params.organizationId,
    )
    res.status(200).send(collections)
  } catch (err) {
    next(err)
  }
}

async function getSpeakerLabelCollection(req, res, next) {
  try {
    const collection = await verifyOwnership(
      model.speakerLabelCollections,
      req.params.collectionId,
      req.params.organizationId,
      SpeakerLabelCollectionNotFound,
    )
    res.status(200).send(collection)
  } catch (err) {
    next(err)
  }
}

async function createSpeakerLabelCollection(req, res, next) {
  try {
    const name = sanitizeName(req.body.name)
    if (!name) {
      throw new SpeakerLabelCollectionError("name is required (max 200 chars)")
    }

    // Organization collections cannot be created via the API
    if (req.body.type === COLLECTION_TYPE.ORGANIZATION) {
      throw new SpeakerLabelCollectionError(
        "Organization collections are managed automatically",
      )
    }

    const type = req.body.type || COLLECTION_TYPE.CUSTOM
    if (!Object.values(COLLECTION_TYPE).includes(type)) {
      throw new SpeakerLabelCollectionError("Invalid collection type")
    }

    const storageMode = req.body.storageMode || STORAGE_MODE.AUDIO
    if (!Object.values(STORAGE_MODE).includes(storageMode)) {
      throw new SpeakerLabelCollectionError("Invalid storage mode")
    }

    const payload = {
      name,
      description: sanitizeDescription(req.body.description),
      organizationId: req.params.organizationId,
      type,
      storageMode,
    }

    const result = await model.speakerLabelCollections.create(payload)

    if (result.insertedCount !== 1) {
      throw new SpeakerLabelCollectionError(
        "Error during the creation of the speaker label collection",
      )
    }

    const created = await model.speakerLabelCollections.getById(
      result.insertedId.toString(),
    )
    res.status(201).send(created[0])
  } catch (err) {
    next(err)
  }
}

async function updateSpeakerLabelCollection(req, res, next) {
  try {
    const doc = await verifyOwnership(
      model.speakerLabelCollections,
      req.params.collectionId,
      req.params.organizationId,
      SpeakerLabelCollectionNotFound,
    )
    if (req.body.name !== undefined) {
      const updatedName = sanitizeName(req.body.name)
      if (!updatedName) {
        throw new SpeakerLabelCollectionError(
          "name is required (max 200 chars)",
        )
      }
      doc.name = updatedName
    }
    if (req.body.description !== undefined) {
      doc.description = sanitizeDescription(req.body.description)
    }

    const result = await model.speakerLabelCollections.update(doc)

    if (result.modifiedCount === 0) {
      res.status(304).send("Nothing to update")
    } else {
      const updated = await model.speakerLabelCollections.getById(
        req.params.collectionId,
      )
      res.status(200).send(updated[0])
    }
  } catch (err) {
    next(err)
  }
}

async function deleteSpeakerLabelCollection(req, res, next) {
  try {
    await verifyOwnership(
      model.speakerLabelCollections,
      req.params.collectionId,
      req.params.organizationId,
      SpeakerLabelCollectionNotFound,
    )

    // Cascade: delete all voice signatures + audio files for this collection
    const signatures = await model.voiceSignatures.getByCollectionId(
      req.params.collectionId,
    )
    cascadeDeleteSignatureFiles(signatures)

    // Parallel: delete voice signature records and speaker labels
    await Promise.all([
      model.voiceSignatures.deleteAllFromCollection(req.params.collectionId),
      model.speakerLabels.deleteAllFromCollection(req.params.collectionId),
    ])

    // Delete the collection itself
    const result = await model.speakerLabelCollections.delete(
      req.params.collectionId,
    )
    if (result.deletedCount !== 1) {
      throw new SpeakerLabelCollectionError(
        "Error during the deletion of the speaker label collection",
      )
    }

    res.status(200).send("Speaker label collection deleted")
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSpeakerLabelCollections,
  getSpeakerLabelCollection,
  createSpeakerLabelCollection,
  updateSpeakerLabelCollection,
  deleteSpeakerLabelCollection,
  verifyOwnership,
  sanitizeName,
}
