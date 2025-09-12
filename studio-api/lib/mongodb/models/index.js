module.exports = {
  categories: require("./categories.js"),
  conversationExport: require("./conversationExport.js"),
  conversationSubtitles: require("./conversationSubtitles.js"),
  conversations: require("./conversations.js"),
  favorites: require("./favorites.js"),
  metadata: require("./metadata.js"),
  organizations: require("./organizations.js"),
  sessionData: require("./sessionData.js"),
  tags: require("./tags.js"),
  tokens: require("./tokens.js"),
  users: require("./users.js"),
  metrics: require("./metrics.js"),
  search: {
    conversations: require("./search/conversations.js"),
    tags: require("./search/tags.js"),
  },
}
