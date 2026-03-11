const config = {
  ...require("./folder.json"),
}

if (process.env.SESSION_API_ENDPOINT !== "") {
  Object.assign(config, require("./sessions.json"))
}

module.exports = config
