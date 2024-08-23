const config = {}

if (process.env.SESSION_API_HOST !== "") {
  Object.assign(config, require("./transcriber-profiles.json"))
  Object.assign(config, require("./sessions.json"))
}

module.exports = config
