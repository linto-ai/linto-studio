module.exports = {
  responses: {
    ...require('./responses/authenticate.json'),
    ...require('./responses/errors.json'),
  },
  schemas: {
    ...require('./schemas/conversation.json'),
    ...require('./schemas/organization-reduce.json'),
    ...require('./schemas/organization.json'),
    ...require('./schemas/service.json'),
    ...require('./schemas/services.json'),
    ...require('./schemas/user.json')
  }
}