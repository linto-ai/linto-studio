module.exports = {
  activityLog: require("./activityLog.js"),
  categories: require("./categories.js"),
  conversationExport: require("./conversationExport.js"),
  conversationSubtitles: require("./conversationSubtitles.js"),
  conversations: require("./conversations.js"),
  favorites: require("./favorites.js"),
  kpiDaily: require("./kpi.daily.js"),
  kpiMontly: require("./kpi.monthly.js"),
  kpi: {
    sessions: require("./kpi.session.js"),
  },
  metadata: require("./metadata.js"),
  organizations: require("./organizations.js"),
  sessionData: require("./sessionData.js"),
  tags: require("./tags.js"),
  tokens: require("./tokens.js"),
  users: require("./users.js"),
  search: {
    conversations: require("./search/conversations.js"),
    tags: require("./search/tags.js"),
  },
}
