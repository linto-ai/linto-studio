const proxyForwardParams = [
  { "body.owner": "payload.data.userId" },
  { "body.organizationId": "params.organizationId" },
]

const { storeSessionFromStop, storeQuickMeetingFromStop } = require(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
)
const {
  forceQueryParams,
  forwardSessionAlias,
  forwardSessionAliasPublic,
  checkTranscriberProfileAccess,
  afterProxyAccess,
  generatPublicToken,
  checkSessionMatchingOrganization,
} = require(
  `${process.cwd()}/components/WebServer/controllers/session/session.js`,
)
const { Unauthorized, UnauthorizedProxy } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
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
      {
        //member access
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/transcriber_profiles",
            method: ["get"],
            executeAfterResult: [checkTranscriberProfileAccess],
          },
        ],
        requireAuth: true,
        requireOrganizationQuickMeetingAccess: true,
      },

      /*************************/
      /******* template  *******/
      /*************************/
      {
        //member access
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/templates",
            method: ["get"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/templates",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/templates/:id",
            method: ["get"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/templates/:id",
            method: ["put"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/templates/:id",
            method: ["delete"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
        requireOrganizationMeetingManagerAccess: true,
      },
      /*************************/
      /******** sessions *******/
      /*************************/
      {
        //public access
        scrapPath: /\/public$/,
        paths: [
          {
            path: "/sessions/:id/public",
            method: ["get"],
            addParams: [{ "body.visibility": "public" }],
            executeBeforeResult: forwardSessionAliasPublic,
            executeAfterResult: [
              (jsonString) => {
                try {
                  let session = JSON.parse(jsonString)

                  if (session.visibility === "public") {
                    session.channels.forEach((channel) => {
                      if (channel.streamEndpoints) {
                        delete channel.streamEndpoints
                      }
                    })

                    return JSON.stringify(session)
                  }

                  throw new UnauthorizedProxy()
                } catch (err) {
                  throw err
                }
              },
              (jsonString, req) => {
                return generatPublicToken(jsonString, req)
              },
            ],
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
            executeBeforeResult: forwardSessionAlias,
            executeAfterResult: [afterProxyAccess],
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
        //quick meeting access
        scrapPath: /^\/users\/self/,
        paths: [
          {
            path: "/users/self/quickMeeting/",
            method: ["get"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: forceQueryParams,
          },
        ],
        requireAuth: true,
        rewrite: {
          fromPath: "/quickMeeting/",
          toPath: "/sessions/",
        },
      },
      {
        //quick meeting access
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/quickMeeting/",
            method: ["get"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: forceQueryParams,
          },
          {
            path: "/organizations/:organizationId/quickMeeting/",
            method: ["post"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: forceQueryParams,
          },
          {
            path: "/organizations/:organizationId/quickMeeting/:id",
            method: ["delete"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: storeQuickMeetingFromStop.bind(webServer),
          },
          {
            path: "/organizations/:organizationId/bots",
            method: ["get", "post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/bots/:id",
            method: ["get", "delete"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
        requireOrganizationQuickMeetingAccess: true,
        rewrite: {
          fromPath: "/quickMeeting/",
          toPath: "/sessions/",
        },
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
            method: ["put", "patch"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: checkSessionMatchingOrganization,
          },
          {
            path: "/organizations/:organizationId/sessions/:id",
            method: ["delete"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: storeSessionFromStop.bind(webServer),
          },
          {
            path: "/organizations/:organizationId/sessions/:id/stop",
            method: ["put"],
            forwardParams: proxyForwardParams,
            executeBeforeResult: checkSessionMatchingOrganization,
          },
          {
            path: "/organizations/:organizationId/sessions/purge",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
        requireOrganizationMeetingManagerAccess: true,
      },
      /*******************************/
      /*** calendar-subscriptions ***/
      /*******************************/
      {
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/calendar-subscriptions",
            method: ["get", "post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/calendar-subscriptions/:id",
            method: ["get", "put", "delete"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
        requireOrganizationMeetingManagerAccess: true,
      },
      /*******************************/
      /**** integration-configs ****/
      /*******************************/
      {
        // Public access — authenticated by provisioningToken query param (no JWT)
        paths: [
          {
            path: "/media-hosts/:id/setup-script",
            method: ["get"],
          },
          {
            path: "/media-hosts/:id/media-host-package",
            method: ["get"],
          },
        ],
        requireAuth: false,
      },
      {
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/integration-configs",
            method: ["get", "post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/integration-configs/:id",
            method: ["get", "put", "delete"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/integration-configs/:id/validate-credentials",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/integration-configs/platform-status/:provider",
            method: ["get"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
        requireOrganizationMeetingManagerAccess: true,
      },
      /*******************************/
      /******* media-hosts **********/
      /*******************************/
      {
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/integration-configs/:configId/media-hosts",
            method: ["get", "post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/media-hosts/:id",
            method: ["get", "delete"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/media-hosts/:id/generate-provisioning-token",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/media-hosts/:id/generate-deploy-link",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
          {
            path: "/organizations/:organizationId/media-hosts/:id/check-connectivity",
            method: ["post"],
            forwardParams: proxyForwardParams,
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
        requireOrganizationMeetingManagerAccess: true,
      },
      /*******************************/
      /******* teams-app ************/
      /*******************************/
      {
        scrapPath: /^\/organizations\/[^/]+/,
        paths: [
          {
            path: "/organizations/:organizationId/teams-app/download",
            method: ["get"],
          },
          {
            path: "/organizations/:organizationId/teams-app/info",
            method: ["get"],
          },
        ],
        requireAuth: true,
        orgaPermissionAccess: PERMISSIONS.SESSION,
      },
    ],
  }
}
