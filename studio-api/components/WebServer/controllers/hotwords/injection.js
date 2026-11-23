const model = require(`${process.cwd()}/lib/mongodb/models`)
const { ConversationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)
const { HotwordDictionaryForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/hotwordDictionary`,
)
const { mergeDictionaries } = require(
  `${process.cwd()}/lib/transcription/hotwords`,
)

function parseDictionaryIds(raw) {
  if (raw === undefined || raw === null || raw === "") return []
  let ids
  try {
    ids = JSON.parse(raw)
  } catch (err) {
    ids = null
  }
  if (!Array.isArray(ids)) {
    throw new ConversationError(
      "hotwordDictionaries must be a JSON array of dictionary ids",
    )
  }
  return ids.map((id) => String(id))
}

// The dictionaries an upload names, all of its organization
async function readHotwords(body, organizationId) {
  const ids = parseDictionaryIds(body.hotwordDictionaries)
  const dictionaries = await Promise.all(
    ids.map(async (id) => {
      const result = await model.hotwordDictionaries.getByIdInOrganization(
        id,
        organizationId,
      )
      if (!Array.isArray(result) || result.length === 0) {
        throw new HotwordDictionaryForbidden()
      }
      return result[0]
    }),
  )
  return {
    words: mergeDictionaries(dictionaries),
    dictionaryNames: dictionaries.map((dictionary) => dictionary.name),
  }
}

module.exports = { readHotwords }
