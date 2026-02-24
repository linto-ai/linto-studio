const debug = require("debug")(
  "linto:components:WebServer:routes:api:nlp:nlp",
)
const { keywordExtract } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/keyword/keyword.js`,
)

module.exports = (webserver) => {
  return [
    {
      path: "/conversations/:conversationId/keywords",
      method: "post",
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: keywordExtract,
    },
  ]
}
