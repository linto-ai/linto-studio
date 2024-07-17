module.exports = (webserver) => {
  return [
    {
      path: "/healthcheck",
      method: "get",
      controller: async (req, res, next) => {
        try {
          res.json({ status: "ok" })
        } catch (err) {
          next(err)
        }
      },
    },
  ]
}
