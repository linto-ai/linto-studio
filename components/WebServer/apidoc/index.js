module.exports = {
  ...require('./api/auth.json'),
  ...require('./api/healthcheck.json'),
  ...require('./api/services.json'),
  ...require('./api/users.json'),
  ...require('./api/organizations/organizations.json'),
  ...require('./api/organizations/members.json'),
  ...require('./api/organizations/maintainer.json'),
  ...require('./api/organizations/admin.json'),
  ...require('./api/conversations/conversation.json'),
  ...require('./api/conversations/member.json'),
  ...require('./api/conversations/nlp.json'),
  ...require('./api/conversations/turn.json'),
}