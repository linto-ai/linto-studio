const { deleteSessionAudioFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

// The Session API only drops the row, its recordings live on the shared volume.
async function dropSessionAudio(result, req) {
  await deleteSessionAudioFiles(req.params.id)
  return result
}

module.exports = (webServer) => {
  return {
    basePath: "/api/administration",
    proxyHost: process.env.SESSION_API_ENDPOINT,
    proxyPaths: [
      /*************************/
      /** transcriber profiles */
      /*************************/
      {
        paths: [
          {
            path: "/transcriber_profiles",
            method: ["get"],
          },

          { path: "/transcriber_profiles", method: ["post"] },
          {
            path: "/transcriber_profiles/:id",
            method: ["get", "put", "delete"],
          },
        ],
        requireAuth: true,
        requireSessionOperator: true,
      },

      /*************************/
      /******* Session  ********/
      /*************************/
      {
        paths: [
          {
            path: "/sessions",
            method: ["get", "post"],
          },
          {
            path: "/sessions/purge",
            method: ["post"],
          },
          {
            path: "/sessions/:id",
            method: ["get", "put"],
          },
          {
            path: "/sessions/:id",
            method: ["delete"],
            executeAfterResult: [dropSessionAudio],
          },
          {
            path: "/sessions/:id/stop",
            method: ["put"],
          },
        ],
        requireAuth: true,
        requireSessionOperator: true,
      },

      /*************************/
      /********  Bots  *********/
      /*************************/
      {
        paths: [
          {
            path: "/bots",
            method: ["get", "post"],
          },
          {
            path: "/bots/:id",
            method: ["get", "delete"],
          },
        ],
        requireAuth: true,
        requireSessionOperator: true,
      },
    ],
  }
}
