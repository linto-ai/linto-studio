const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:import`)
const utf8 = require('utf8')


const { addFileMetadataToConversation, initConversation } = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const CONVERSATION_RIGHT = require(`${process.cwd()}/lib/dao/conversation/rights`)
const { storeFile } = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  ConversationMetadataRequire,
  ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

async function addFileToConv(conversation, req) {
  if (req.files) {
    const fileData = {
      ...req.files.file,
      name: utf8.decode(req.files.file.name)
    }
    let file_data = await storeFile(fileData, 'audio')
    conversation = await addFileMetadataToConversation(conversation, file_data)
  }

  return conversation
}

async function importConv(req, res) {
  try {
    let conversation
    try {
      conversation = JSON.parse(req.body.conversation)
    } catch (err) {
      throw new ConversationMetadataRequire("Conversation is not a valid json")
    }

    delete conversation._id

    if (!conversation.name) throw new ConversationMetadataRequire("Conversation name key is required")
    if (!conversation.locale) throw new ConversationMetadataRequire("Conversation locale key is required")


    if (!conversation?.organization) {
      conversation.organization = {}
      if (!conversation.organization?.organizationId) conversation.organization.organizationId = req.body.organizationId
      if (!conversation.organization?.membersRight) conversation.organization.membersRight = CONVERSATION_RIGHT.READ + CONVERSATION_RIGHT.COMMENT
      if (!conversation.organization?.customRights) conversation.organization.customRights = []
    }
    conversation.owner = req.payload.data.userId
    await addFileToConv(conversation, req)

    conversation = await conversationModel.createConversation(conversation)

    res.status(200).send({ message: 'Conversation imported' })
    return
  } catch (error) {
    throw new ConversationError(error.message)
  }
}

async function importTranscription(req, res) {
  if (!req.body.name) throw new ConversationMetadataRequire("name param is required")
  if (!req.body.lang) throw new ConversationMetadataRequire("lang param is required")
  if (!req.body.transcription) throw new ConversationMetadataRequire("transcription param is required")
  if (!req.body.membersRight) req.body.membersRight = CONVERSATION_RIGHT.READ + CONVERSATION_RIGHT.COMMENT

  let conversation = initConversation(req.body, req.body.userId, 'imported')
  await addFileToConv(conversation, req)

  let filter = {}
  if (req.body.segmentWordSize) filter.segmentWordSize = req.body.segmentWordSize
  if (req.body.segmentCharSize) filter.segmentCharSize = req.body.segmentCharSize

  let transcription = {}
  try {
    transcription = JSON.parse(req.body.transcription)
  } catch (err) {
    throw new ConversationMetadataRequire("Transcription is not a valid json")
  }
  const normalizeTranscription = segmentNormalizeText(transcription, conversation.locale, filter)
  conversation = SttWrapper.transcriptionToConversation(normalizeTranscription, conversation)

  const result = await conversationModel.createConversation(conversation)
  if (result.insertedCount !== 1) throw new ConversationError()

  res.status(200).send({ message: 'Conversation imported' })
  return
}

async function importConversation(req, res, next) {
  try {
    req.body.organizationId = await orgaUtility.checkOrganization(req.body.organizationId, req.payload.data.userId)
    req.body.userId = req.payload.data.userId

    if (req.query.type === 'conversation') await importConv(req, res)
    else if (req.query.type === 'transcription') await importTranscription(req, res)
    else if (req.query.type === 'srt') await importSrt(req, res)
    else if (req.query.type === 'audapolis') await importAudapolis(req, res)
    else if (req.query.type) throw new ConversationError(`Query param type ${req.query.type} is not supported, Supported type are : conversation, transcription, srt, audapolis`)
    else throw new ConversationError("Query param type is required")

  } catch (err) {
    next(err)
  }

}

module.exports = {
  importConversation
}