module.exports = {
  categories : require('./categories.js'),
  conversation : require('./conversations.js'),
  organization : require('./organizations.js'),
  tag : require('./tags.js'),
  user : require('./users.js'),
  search : {
    conversation : require('./search/conversations.js'),
    tag : require('./search/tags.js')
  }
}
