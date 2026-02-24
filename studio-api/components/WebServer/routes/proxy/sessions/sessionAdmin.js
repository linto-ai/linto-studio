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
            path: "bots/:id",
            method: ["get", "delete"],
          },
        ],
        requireAuth: true,
        requireSessionOperator: true,
      },
      /***************************************/
      /** platform integration-configs (admin) */
      /***************************************/
      {
        paths: [
          {
            path: "/integration-configs/platform",
            method: ["get", "post"],
          },
          {
            path: "/integration-configs/platform/:id",
            method: ["get", "put", "delete"],
          },
          {
            path: "/integration-configs/platform/:id/validate-credentials",
            method: ["post"],
          },
          {
            path: "/integration-configs/platform/:provider/usage",
            method: ["get"],
          },
        ],
        requireAuth: true,
        requireSessionOperator: true,
        rewrite: {
          fromPath: "/integration-configs/platform",
          toPath: "/admin/integration-configs/platform",
        },
      },
      /***************************************/
      /** media-hosts (admin) ****************/
      /***************************************/
      {
        paths: [
          {
            path: "/integration-configs/:configId/media-hosts",
            method: ["get", "post"],
          },
          {
            path: "/media-hosts/:id",
            method: ["get", "delete"],
          },
          {
            path: "/media-hosts/:id/generate-provisioning-token",
            method: ["post"],
          },
          {
            path: "/media-hosts/:id/generate-deploy-link",
            method: ["post"],
          },
          {
            path: "/media-hosts/:id/check-connectivity",
            method: ["post"],
          },
        ],
        requireAuth: true,
        requireSessionOperator: true,
      },
    ],
  }
}
