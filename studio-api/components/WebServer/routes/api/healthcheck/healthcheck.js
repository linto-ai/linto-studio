const debug = require("debug")(
  "linto:components:WebServer:routes:api:healthcheck:healthcheck",
)

module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      requireAuth: false, // we use an other middleware for the interface
      controller: [
        (req, res, next) => {
          res.status(200).json({ status: "ok" })
        },
      ],
    },
  ]
}
