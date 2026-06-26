const config = {
  ...require("./export-request.json"),
  ...require("./screen.json"),
  ...require("./security-level.json"),
  ...require("./type.json"),
  ...require("./user-shared.json"),
}

module.exports = config
