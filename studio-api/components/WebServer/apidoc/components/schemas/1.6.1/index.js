const config = {}

if (process.env.SESSION_API_ENDPOINT !== "") {
  Object.assign(config, require("./sessions_data.json"))
}

module.exports = config
