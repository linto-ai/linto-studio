const { transcriptionToConversation } = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { initConversation } = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)

const { v4: uuidv4 } = require('uuid');

const param_metadata = require('../../data/conversation/metadata.json')


describe('initialzation conversation', () => {
  let MOCK_TRANSCRIPTION_NO_PUNC, MOCK_TRANSCRIPTION_PUNC
  let user_id, job_id, conversation_metadata

  beforeAll(async () => {
    MOCK_TRANSCRIPTION_NO_PUNC = require('../../data/transcription/mock-trans-no-punc.json')
    user_id = uuidv4()
    job_id = uuidv4()
    conversation_metadata = initConversation(param_metadata, user_id, job_id)
  })

  afterAll(async () => {
  })

  it('should create a conversation based from an transcription', () => {
    let conversation = transcriptionToConversation(MOCK_TRANSCRIPTION_NO_PUNC, conversation_metadata)

    expect(conversation.name).toEqual(param_metadata.name)
    expect(conversation.description).toEqual(param_metadata.description)
    expect(conversation.organization.organizationId).toEqual(param_metadata.organizationId)
    expect(conversation.organization.membersRight).toEqual(param_metadata.membersRight)
    expect(conversation.sharedWithUsers.length).toEqual(param_metadata.sharedWithUsers.length)
    expect(conversation.sharedWithUsers[0]).toEqual(param_metadata.sharedWithUsers[0])

    expect(conversation.speakers.length).toEqual(1)
    expect(conversation.text.length).toEqual(1)
    expect(conversation.text[0].words.length).toEqual(MOCK_TRANSCRIPTION_NO_PUNC.segments[0].words.length)
    expect(conversation.text[0].raw_segment).toEqual(MOCK_TRANSCRIPTION_NO_PUNC.segments[0].raw_segment)
  })

  it('should throw an exception when no transcription', () => {
    expect(() => transcriptionToConversation(undefined, conversation_metadata)).toThrow()
    expect(() => transcriptionToConversation(undefined, conversation_metadata)).toThrow('Transcription was empty')
  })

  it('should throw an exception when no conversation', () => {
    expect(() => transcriptionToConversation(MOCK_TRANSCRIPTION_NO_PUNC, undefined)).toThrow()
  })
})


