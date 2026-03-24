const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  cascadeDeleteSampleFiles,
  COLLECTION_TYPE,
  STORAGE_MODE,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  VoiceprintCollectionError,
  VoiceprintCollectionNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
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

async function verifyOwnership(modelRef, id, organizationId, NotFoundError) {
  const result = await modelRef.getById(id)
  if (result.length === 0) throw new NotFoundError()
  if (result[0].organizationId.toString() !== organizationId) {
    throw new NotFoundError()
  }
  return result[0]
}

async function ensureOrganizationCollection(organizationId) {
  const all = await model.voiceprintCollections.getByOrganizationId(organizationId)
  const hasOrgCollection = all.some(
    (c) => c.type === COLLECTION_TYPE.ORGANIZATION,
  )
  if (!hasOrgCollection) {
    const result = await model.voiceprintCollections.create({
      name: "Organization",
      description: "",
      organizationId,
      type: COLLECTION_TYPE.ORGANIZATION,
      storageMode: STORAGE_MODE.AUDIO,
    })
    if (result.insertedCount === 1) {
      const created = await model.voiceprintCollections.getById(
        result.insertedId.toString(),
      )
      all.push(created[0])
    }
  }
  return all
}

async function getVoiceprintCollections(req, res, next) {
  try {
    const collections = await ensureOrganizationCollection(
      req.params.organizationId,
    )
    res.status(200).send(collections)
  } catch (err) {
    next(err)
  }
}

async function getVoiceprintCollection(req, res, next) {
  try {
    const collection = await verifyOwnership(
      model.voiceprintCollections,
      req.params.collectionId,
      req.params.organizationId,
      VoiceprintCollectionNotFound,
    )
    res.status(200).send(collection)
  } catch (err) {
    next(err)
  }
}

async function createVoiceprintCollection(req, res, next) {
  try {
    const name = sanitizeName(req.body.name)
    if (!name) {
      throw new VoiceprintCollectionError("name is required (max 200 chars)")
    }

    if (req.body.type === COLLECTION_TYPE.ORGANIZATION) {
      throw new VoiceprintCollectionError(
        "Organization collections are managed automatically",
      )
    }

    const type = req.body.type || COLLECTION_TYPE.CUSTOM
    if (!Object.values(COLLECTION_TYPE).includes(type)) {
      throw new VoiceprintCollectionError("Invalid collection type")
    }

    const storageMode = req.body.storageMode || STORAGE_MODE.AUDIO
    if (!Object.values(STORAGE_MODE).includes(storageMode)) {
      throw new VoiceprintCollectionError("Invalid storage mode")
    }

    const payload = {
      name,
      description: sanitizeDescription(req.body.description),
      organizationId: req.params.organizationId,
      type,
      storageMode,
    }

    const result = await model.voiceprintCollections.create(payload)

    if (result.insertedCount !== 1) {
      throw new VoiceprintCollectionError(
        "Error during the creation of the voiceprint collection",
      )
    }

    const created = await model.voiceprintCollections.getById(
      result.insertedId.toString(),
    )
    res.status(201).send(created[0])
  } catch (err) {
    next(err)
  }
}

async function updateVoiceprintCollection(req, res, next) {
  try {
    const doc = await verifyOwnership(
      model.voiceprintCollections,
      req.params.collectionId,
      req.params.organizationId,
      VoiceprintCollectionNotFound,
    )
    if (req.body.name !== undefined) {
      const updatedName = sanitizeName(req.body.name)
      if (!updatedName) {
        throw new VoiceprintCollectionError(
          "name is required (max 200 chars)",
        )
      }
      doc.name = updatedName
    }
    if (req.body.description !== undefined) {
      doc.description = sanitizeDescription(req.body.description)
    }

    const result = await model.voiceprintCollections.update(doc)

    if (result.modifiedCount === 0) {
      res.status(304).send("Nothing to update")
    } else {
      const updated = await model.voiceprintCollections.getById(
        req.params.collectionId,
      )
      res.status(200).send(updated[0])
    }
  } catch (err) {
    next(err)
  }
}

async function deleteVoiceprintCollection(req, res, next) {
  try {
    await verifyOwnership(
      model.voiceprintCollections,
      req.params.collectionId,
      req.params.organizationId,
      VoiceprintCollectionNotFound,
    )

    const samples = await model.voiceSamples.getByCollectionId(
      req.params.collectionId,
    )
    cascadeDeleteSampleFiles(samples)

    await Promise.all([
      model.voiceSamples.deleteAllFromCollection(req.params.collectionId),
      model.speakerLabels.deleteAllFromCollection(req.params.collectionId),
    ])

    const result = await model.voiceprintCollections.delete(
      req.params.collectionId,
    )
    if (result.deletedCount !== 1) {
      throw new VoiceprintCollectionError(
        "Error during the deletion of the voiceprint collection",
      )
    }

    res.status(200).send("Voiceprint collection deleted")
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getVoiceprintCollections,
  getVoiceprintCollection,
  createVoiceprintCollection,
  updateVoiceprintCollection,
  deleteVoiceprintCollection,
  verifyOwnership,
  sanitizeName,
}
