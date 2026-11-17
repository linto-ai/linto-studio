const { computeFeatures } = require(`${process.cwd()}/lib/features`)

// Public: the fronts need it before anyone signs in, to know which pages and
// menus this deployment has. While the components load (the WebServer
// answers first; CloudService and BrokerClient come later), the answer would
// say "off" for what is only not there yet, and the fronts keep it until
// reloaded: 503 until then, which they show as an API not answering yet.
module.exports = (webserver) => {
  return [
    {
      path: "/",
      method: "get",
      requireAuth: false,
      controller: [
        (req, res) => {
          switch (true) {
            case !webserver.app.componentsLoaded:
              return res.status(503).json({ status: "starting" })
            default:
              return res
                .status(200)
                .json(computeFeatures(webserver.app.components))
          }
        },
      ],
    },
  ]
}
