module.exports = {
  responses: {
    ...require('./responses/authenticate.json'),
    ...require('./responses/errors.json'),
  },
  schemas: {
    ...require('./schemas/conversation-list.json'),
    ...require('./schemas/conversation.json'),
    ...require('./schemas/organization-users.json'),
    ...require('./schemas/organization.json'),
    ...require('./schemas/service.json'),
    ...require('./schemas/services.json'),
    ...require('./schemas/speakers.json'),
    ...require('./schemas/turn.json'),
    ...require('./schemas/transcription-config.json'),
    ...require('./schemas/user-role.json'),
    ...require('./schemas/user.json'),
    ...require('./schemas/word.json')
  }
}