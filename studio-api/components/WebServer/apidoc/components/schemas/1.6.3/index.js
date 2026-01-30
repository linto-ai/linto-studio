const config = {}

if (process.env.SESSION_API_ENDPOINT !== "") {
  Object.assign(config, require("./sessions.json"))
  Object.assign(config, require("./transcriber_profiles.json"))
}

module.exports = config
