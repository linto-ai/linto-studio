const debug = require("debug")("linto:components:WebServer:routes:root:index")
const middlewares = require(
  `${process.cwd()}/components/WebServer/middlewares/index.js`,
)

module.exports = (webServer) => {
  return [
    {
      path: "/",
      method: "get",
      requireAuth: false, // we use an other middleware for the interface
      controller: [
        (req, res, next) => {
          res.redirect("/login")
        },
      ],
    },
  ]
}
