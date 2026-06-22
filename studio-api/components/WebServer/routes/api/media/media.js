const debug = require("debug")(
  "linto:components:WebServer:routes:api:media:media",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const fs = require("fs")

const { getOrCreateWaveform } = require(
  `${process.cwd()}/components/WebServer/controllers/files/waveform`,
)

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
            const filePath = `${process.cwd()}/${process.env.VOLUME_FOLDER}/${conversation[0].metadata.audio.filepath}`
            if (!fs.existsSync(filePath)) {
              res
                .status(404)
                .send({ message: "Error on fetching the audio file" })
            } else if (req.query.mediatype === "json") {
              // Precomputed waveform peaks, generated and cached on first request
              const waveformPath = await getOrCreateWaveform(filePath)
              res.setHeader("Content-Type", "application/json")
              res.sendFile(waveformPath)
            } else {
              res.setHeader("Content-Type", "audio/mpeg")
              res.sendFile(filePath)
            }
          } else {
            res
              .status(204)
              .send({ message: "Conversation doesn't have any audio" })
          }
        } catch (err) {
          next(err)
        }
      },
    },
  ]
}
