const config = {}

if (process.env.SESSION_API_ENDPOINT !== "") {
  Object.assign(config, require("./sessions.json"))
  Object.assign(config, require("./templates.json"))
  Object.assign(config, require("./transcriber_profiles.json"))
  Object.assign(config, require("./sessions_alias.json"))
  Object.assign(config, require("./sessions_metrics.json"))
}

module.exports = config
