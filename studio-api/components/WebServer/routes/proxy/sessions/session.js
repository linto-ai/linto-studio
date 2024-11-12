const proxyForwardParams = [
  { "body.owner": "payload.data.userId" },
  { "body.organizationId": "params.organizationId" },
]

const { storeSessionFromStop } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

module.exports = (webServer) => {
  return {
    basePath: "/api",
    proxyHost: process.env.SESSION_API_ENDPOINT,
    proxyPaths: [
      /*************************/
      /***** healthcheck *******/
      /*************************/
      {
        paths: [
          {
            path: "/healthcheck",
            method: ["get"],
          },
        ],
        disabled: true,
        requireAuth: false,
      },

      /*************************/
      /** transcriber profiles */
      /*************************/
      {
        paths: [
          { path: "/transcriber_profiles", method: ["get", "post"] },
          {
            path: "/transcriber_profiles/:id",
            method: ["get", "put", "delete"],
          },
        ],
        requireAuth: true,
      },

      /*************************/
      /******** sessions *******/
      /*************************/ {
        //public access
        scrapPath: /\/public$/,
        paths: [
          {
            path: "/sessions/:id/public",
            method: ["get"],
            addParams: [{ "body.visibility": "public" }],
          },
        ],
        requireAuth: false,
      },
      {
        //member access
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/sessions/:id",
            method: ["get"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/sessions",
            method: ["get"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        requireOrganizationMemberAccess: true,
      },
      {
        // Meeting Manager access
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/sessions/",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/sessions/:id",
            method: ["put"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/sessions/:id",
            method: ["delete"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: storeSessionFromStop,
          },
          {
            path: "/organizations/:organizationId/sessions/:id/stop",
            method: ["put"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/sessions/purge",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/sessions/:id/start-bot",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/sessions/:id/stop-bot",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
        requireOrganizationMeetingManagerAccess: true,
      },
    ],
  }
}
