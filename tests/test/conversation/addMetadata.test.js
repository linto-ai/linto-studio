const generator = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const param_metadata = require('../../data/conversation/metadata.json')

describe('initialzation conversation', () => {
  let user_id, job_id, file, conversation_template

  beforeAll(async () => {
    user_id = uuidv4()
    job_id = uuidv4()

    file = {
      name: 'audio.mp3',
      data: fs.readFileSync(`${process.cwd()}/tests/data/audio/audio.mp3`),
      mimetype: 'audio/mpeg',
      md5: 'da1490ff7b8d7bedcb654bcbb7206501',
      filePath: `${process.cwd()}/tests/data/audio/audio.mp3`,
      originalFilePath: `${process.cwd()}/tests/data/audio/audio.mp3`,
      storageFilePath: `${process.cwd()}/tests/data/audio/audio.mp3`,
      originalFileName: `audio.mp3`
    }

    conversation_template = generator.initConversation(param_metadata, user_id, job_id)
  })

  afterAll(async () => {
  })

  it('should add file metadata to conversation', async () => {
    const conversation = await generator.addFileMetadataToConversation(conversation_template, file)

    expect(conversation.metadata.audio).not.toBeUndefined()

    expect(conversation.metadata.audio.filename).toEqual(file.name)
    expect(conversation.metadata.audio.duration).not.toBeUndefined()
    expect(conversation.metadata.audio.duration).toEqual(2.808)

    expect(conversation.metadata.audio.mimetype).toEqual(file.mimetype)
    expect(conversation.metadata.audio.filepath).toEqual(file.filePath)

    expect(conversation.metadata.file).not.toBeUndefined()

    expect(conversation.metadata.file.format.duration).toEqual(conversation.metadata.audio.duration)
  })
})


