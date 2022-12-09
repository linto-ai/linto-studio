module.exports = {
  responses: {
    ...require('./responses/authenticate.json'),
    ...require('./responses/errors.json'),
  },
  schemas: {
    ...require('./schemas/service.json'),
    ...require('./schemas/services.json'),
    ...require('./schemas/user.json')

  }
}