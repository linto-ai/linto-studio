module.exports = {
  ...require('./api/auth.json'),
  ...require('./api/healthcheck.json'),
  ...require('./api/services.json'),
  ...require('./api/users.json')

  // ...require('./api/conversations.json'),
  // ...require('./api/organizations.json'),
  // ...require('./api/test.json')
}