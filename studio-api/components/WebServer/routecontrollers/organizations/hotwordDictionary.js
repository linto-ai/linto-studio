const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  HotwordDictionaryError,
  HotwordDictionaryNotFound,
  HotwordDictionaryConflict,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/hotwordDictionary`,
)
const { sanitizeWords, MAX_WORD_LENGTH, MAX_WORDS_PER_DICTIONARY } = require(
  `${process.cwd()}/lib/transcription/hotwords`,
)

const MAX_NAME_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 1000

function readName(name) {
  const trimmed = typeof name === "string" ? name.trim() : ""
  if (trimmed === "" || trimmed.length > MAX_NAME_LENGTH) {
    throw new HotwordDictionaryError(
      `name is required (max ${MAX_NAME_LENGTH} chars)`,
    )
  }
  return trimmed
}

function readDescription(description) {
  if (typeof description !== "string") return ""
  return description.trim().slice(0, MAX_DESCRIPTION_LENGTH)
}

function readWords(words) {
  const sanitized = sanitizeWords(words)
  if (sanitized === null) {
    throw new HotwordDictionaryError(
      `words must be a list of at most ${MAX_WORDS_PER_DICTIONARY} words, each without comma and of at most ${MAX_WORD_LENGTH} chars`,
    )
  }
  return sanitized
}

async function findDictionary(req) {
  const result = await model.hotwordDictionaries.getByIdInOrganization(
    req.params.dictionaryId,
    req.params.organizationId,
  )
  if (!Array.isArray(result) || result.length === 0) {
    throw new HotwordDictionaryNotFound()
  }
  return result[0]
}

async function refuseNameTaken(organizationId, name, exceptId = null) {
  const sameName = await model.hotwordDictionaries.getByOrganizationIdAndName(
    organizationId,
    name,
  )
  const isTaken = sameName.some(
    (dictionary) => dictionary._id.toString() !== exceptId,
  )
  if (isTaken) {
    throw new HotwordDictionaryConflict(
      `A hotword dictionary "${name}" already exists in this organization`,
    )
  }
}

async function getHotwordDictionaries(req, res, next) {
  try {
    const dictionaries = await model.hotwordDictionaries.getByOrganizationId(
      req.params.organizationId,
    )
    res.status(200).send(dictionaries)
  } catch (err) {
    next(err)
  }
}

async function createHotwordDictionary(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const name = readName(req.body.name)
    const words = readWords(req.body.words ?? [])
    await refuseNameTaken(organizationId, name)

    const result = await model.hotwordDictionaries.create({
      name,
      description: readDescription(req.body.description),
      organizationId,
      words,
    })
    if (result.insertedCount !== 1) {
      throw new HotwordDictionaryError(
        "Error during the creation of the hotword dictionary",
      )
    }

    const created = await model.hotwordDictionaries.getByIdInOrganization(
      result.insertedId.toString(),
      organizationId,
    )
    res.status(201).send(created[0])
  } catch (err) {
    next(err)
  }
}

async function updateHotwordDictionary(req, res, next) {
  try {
    const dictionary = await findDictionary(req)
    const changes = { _id: dictionary._id }
    if (req.body.name !== undefined) {
      changes.name = readName(req.body.name)
      await refuseNameTaken(
        req.params.organizationId,
        changes.name,
        dictionary._id.toString(),
      )
    }
    if (req.body.description !== undefined) {
      changes.description = readDescription(req.body.description)
    }
    if (req.body.words !== undefined) {
      changes.words = readWords(req.body.words)
    }

    await model.hotwordDictionaries.update(changes)
    const updated = await findDictionary(req)
    res.status(200).send(updated)
  } catch (err) {
    next(err)
  }
}

async function deleteHotwordDictionary(req, res, next) {
  try {
    await findDictionary(req)
    const result = await model.hotwordDictionaries.delete(
      req.params.dictionaryId,
    )
    if (result.deletedCount !== 1) {
      throw new HotwordDictionaryError(
        "Error during the deletion of the hotword dictionary",
      )
    }
    res.status(200).send("Hotword dictionary deleted")
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getHotwordDictionaries,
  createHotwordDictionary,
  updateHotwordDictionary,
  deleteHotwordDictionary,
}
