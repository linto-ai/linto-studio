const debug = require("debug")(
  "linto:conversation-manager:router:api:file:files",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

module.exports = (webserver) => {
  return [
    {
      path: "/conversations/:conversationId/media",
      method: "get",
      requireAuth: true,
      requireConversationReadAccess: true,
      controller: async (req, res, next) => {
        try {
          const conversation = await model.conversations.getById(
            req.params.conversationId,
          )
          if (
            conversation.length === 1 &&
            conversation[0].metadata &&
            conversation[0].metadata.audio &&
            conversation[0].metadata.audio.filepath
          ) {
            const fileName = conversation[0].metadata.audio.filepath
              .split("/")
              .pop()
            const file = `${process.cwd()}/${process.env.VOLUME_FOLDER}/${process.env.VOLUME_AUDIO_PATH}/${fileName}`
            res.setHeader("Content-Type", "audio/mpeg")
            res.sendFile(file)
          } else {
            res.status(404).send({ message: "Conversation audio not found" })
          }
        } catch (err) {
          next(err)
        }
      },
    },
  ]
}
