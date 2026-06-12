module.exports = {
  responses: {
    ...require("./responses/authenticate.json"),
    ...require("./responses/error.json"),
    ...require("./responses/response.json"),
  },
  parameters: {
    ...require("./parameters/pagination.json"),
    ...require("./parameters/administration.json"),
    ...require("./parameters/path.json"),
    ...require("./parameters/services.json"),
  },
  schemas: {},
}
