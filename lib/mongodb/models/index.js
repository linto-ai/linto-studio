module.exports = {
  category : require('./category.js'),
  conversation : require('./conversations.js'),
  organization : require('./organizations.js'),
  tag : require('./tags.js'),
  user : require('./users.js'),
  search : {
    category : require('./search/category.js'),
    conversation : require('./search/conversations.js'),
    tag : require('./search/tags.js')
  }
}
