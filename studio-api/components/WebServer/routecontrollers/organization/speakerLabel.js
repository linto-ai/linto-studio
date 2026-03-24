const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  SpeakerLabelError,
  SpeakerLabelNotFound,
  SpeakerLabelConflict,
  VoiceprintCollectionNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

const { verifyOwnership, sanitizeName } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organization/voiceprintCollection`,
)
const { cascadeDeleteSampleFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

async function getSpeakerLabels(req, res, next) {
  try {
    await verifyOwnership(
      model.voiceprintCollections,
      req.params.collectionId,
      req.params.organizationId,
      VoiceprintCollectionNotFound,
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
      model.voiceprintCollections,
      req.params.collectionId,
      req.params.organizationId,
      VoiceprintCollectionNotFound,
    )

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

    const samples = await model.voiceSamples.getBySpeakerLabelId(
      req.params.labelId,
    )
    cascadeDeleteSampleFiles(samples)

    await Promise.all([
      model.voiceSamples.deleteAllFromSpeakerLabel(req.params.labelId),
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
