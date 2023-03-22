module.exports = {
  categories : require('./categories.js'),
  conversations : require('./conversations.js'),
  organizations : require('./organizations.js'),
  tags : require('./tags.js'),
  users : require('./users.js'),
  search : {
    categories : require('./search/categories.js'),
    conversations : require('./search/conversations.js'),
    tags : require('./search/tags.js')
  }
}
