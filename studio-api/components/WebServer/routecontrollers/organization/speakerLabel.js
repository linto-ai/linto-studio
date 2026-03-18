const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  SpeakerLabelError,
  SpeakerLabelNotFound,
  SpeakerLabelConflict,
  SpeakerLabelCollectionNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerDiarization`,
)

const { verifyOwnership, sanitizeName } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/speakerLabelCollection`,
)
const { cascadeDeleteSignatureFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

async function getSpeakerLabels(req, res, next) {
  try {
    await verifyOwnership(
      model.speakerLabelCollections,
      req.params.collectionId,
      req.params.organizationId,
      SpeakerLabelCollectionNotFound,
    )

    const labels = await model.speakerLabels.getByCollectionId(
      req.params.collectionId,
    )
    res.status(200).send(labels)
  } catch (err) {
    next(err)
  }
}

async function getSpeakerLabel(req, res, next) {
  try {
    const label = await verifyOwnership(
      model.speakerLabels,
      req.params.labelId,
      req.params.organizationId,
      SpeakerLabelNotFound,
    )
    if (label.collectionId.toString() !== req.params.collectionId) {
      throw new SpeakerLabelNotFound()
    }
    res.status(200).send(label)
  } catch (err) {
    next(err)
  }
}

async function createSpeakerLabel(req, res, next) {
  try {
    const name = sanitizeName(req.body.name)
    if (!name) {
      throw new SpeakerLabelError("name is required (max 200 chars)")
    }

    await verifyOwnership(
      model.speakerLabelCollections,
      req.params.collectionId,
      req.params.organizationId,
      SpeakerLabelCollectionNotFound,
    )

    // Check for duplicate name in this collection
    const existing = await model.speakerLabels.getByCollectionIdAndName(
      req.params.collectionId,
      name,
    )
    if (existing.length > 0) {
      throw new SpeakerLabelConflict(
        `A speaker label "${name}" already exists in this collection`,
      )
    }

    const payload = {
      name,
      collectionId: req.params.collectionId,
      organizationId: req.params.organizationId,
    }

    const result = await model.speakerLabels.create(payload)

    if (result.insertedCount !== 1) {
      throw new SpeakerLabelError(
        "Error during the creation of the speaker label",
      )
    }

    const created = await model.speakerLabels.getById(
      result.insertedId.toString(),
    )
    res.status(201).send(created[0])
  } catch (err) {
    next(err)
  }
}

async function updateSpeakerLabel(req, res, next) {
  try {
    const doc = await verifyOwnership(
      model.speakerLabels,
      req.params.labelId,
      req.params.organizationId,
      SpeakerLabelNotFound,
    )
    if (doc.collectionId.toString() !== req.params.collectionId) {
      throw new SpeakerLabelNotFound()
    }

    if (req.body.name !== undefined) {
      const updatedName = sanitizeName(req.body.name)
      if (!updatedName) {
        throw new SpeakerLabelError("name is required (max 200 chars)")
      }
      // Check for duplicate name in the same collection
      const existing = await model.speakerLabels.getByCollectionIdAndName(
        doc.collectionId.toString(),
        updatedName,
      )
      if (
        existing.length > 0 &&
        existing[0]._id.toString() !== req.params.labelId
      ) {
        throw new SpeakerLabelConflict(
          `A speaker label "${updatedName}" already exists in this collection`,
        )
      }
      doc.name = updatedName
    }

    const result = await model.speakerLabels.update(doc)

    if (result.modifiedCount === 0) {
      res.status(304).send("Nothing to update")
    } else {
      const updated = await model.speakerLabels.getById(req.params.labelId)
      res.status(200).send(updated[0])
    }
  } catch (err) {
    next(err)
  }
}

async function deleteSpeakerLabel(req, res, next) {
  try {
    const label = await verifyOwnership(
      model.speakerLabels,
      req.params.labelId,
      req.params.organizationId,
      SpeakerLabelNotFound,
    )
    if (label.collectionId.toString() !== req.params.collectionId) {
      throw new SpeakerLabelNotFound()
    }

    // Cascade: delete voice signatures + audio files for this label
    const signatures = await model.voiceSignatures.getBySpeakerLabelId(
      req.params.labelId,
    )
    cascadeDeleteSignatureFiles(signatures)

    // Delete voice signature records and the label in parallel
    await Promise.all([
      model.voiceSignatures.deleteAllFromSpeakerLabel(req.params.labelId),
      model.speakerLabels.delete(req.params.labelId),
    ])

    res.status(200).send("Speaker label deleted")
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSpeakerLabels,
  getSpeakerLabel,
  createSpeakerLabel,
  updateSpeakerLabel,
  deleteSpeakerLabel,
}
