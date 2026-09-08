const debug = require("debug")(
  "linto:components:WebServer:routes:api:sessions:catchup",
)

const { catchUp, catchUpStatus } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
)

// Mounted on "/api/sessions", next to the public session proxy routes
// (routes/proxy/sessions/session.js). `requireAuth` stays false because the
// routes accept EITHER a publicSessionToken (minted by
// GET /api/sessions/public/:id) or a user JWT of an org member: the dual scheme
// is resolved inside the controller, exactly like the socket handshake does.
// API routes are registered before the proxy routes (routes/router.js), so
// these paths are never swallowed by the session proxy.
module.exports = (webserver) => {
  return [
    {
      path: "/public/:id/catchup",
      method: "post",
      requireAuth: false,
      controller: catchUp,
    },
    {
      path: "/public/:id/catchup/status",
      method: "get",
      requireAuth: false,
      controller: catchUpStatus,
    },
  ]
}
