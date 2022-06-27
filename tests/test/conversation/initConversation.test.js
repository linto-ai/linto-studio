const generator = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { v4: uuidv4 } = require('uuid');

const param_metadata = require('../../data/conversation/metadata.json')

describe('initialzation conversation', () => {
  let user_id, job_id

  beforeAll(async () => {
    user_id = uuidv4()
    job_id = uuidv4()
  })

  afterAll(async () => {
  })

  it('should create an conversation based on metadata template', () => {
    const conversation = generator.initConversation(param_metadata, user_id, job_id)

    expect(conversation.name).toEqual(param_metadata.name)
    expect(conversation.description).toEqual(param_metadata.description)
    expect(conversation.organization.organizationId).toEqual(param_metadata.organizationId)
    expect(conversation.organization.membersRight).toEqual(param_metadata.membersRight)
    expect(conversation.sharedWithUsers).not.toBe([])
    expect(conversation.sharedWithUsers.length).toEqual(1)
    expect(conversation.sharedWithUsers[0]).toEqual(param_metadata.sharedWithUsers[0])

    expect(conversation.owner).toEqual(user_id)

    expect(conversation.job.steps).toEqual({})
    expect(conversation.job.job_id).toEqual(job_id)
    expect(conversation.job.state).toEqual('pending')
  })

  it('should create an conversation without shared user', () => {
    let metadata = param_metadata
    delete metadata.sharedWithUsers

    const conversation = generator.initConversation(metadata, user_id, job_id)

    expect(conversation.name).toEqual(param_metadata.name)
    expect(conversation.description).toEqual(param_metadata.description)
    expect(conversation.organization.organizationId).toEqual(param_metadata.organizationId)
    expect(conversation.organization.membersRight).toEqual(param_metadata.membersRight)
    expect(conversation.sharedWithUsers).toEqual([])

    expect(conversation.owner).toEqual(user_id)

    expect(conversation.job.steps).toEqual({})
    expect(conversation.job.job_id).toEqual(job_id)
    expect(conversation.job.state).toEqual('pending')
  })

})


