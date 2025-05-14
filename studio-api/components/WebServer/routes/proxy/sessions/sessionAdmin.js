const proxyForwardParams = [
  { "body.owner": "payload.data.userId" },
  { "body.organizationId": "params.organizationId" },
]

const { storeSessionFromStop, storeQuickMeetingFromStop } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)
const { forceQueryParams } = require(
  `${process.cwd()}/components/WebServer/controllers/session/session.js`,
)
const { Unauthorized } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

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
            path: "/sessions/",
            method: ["get", "post"],
          },
          {
            path: "/sessions/purge",
            method: ["post"],
          },
          {
            path: "/sessions/:id",
            method: ["get", "put", "delete"],
          },
          {
            path: "/sessions/:id/stop",
            method: ["put"],
          },
        ],
        requireAuth: true,
        requireSessionOperator: true,
      },
    ],
  }
}
