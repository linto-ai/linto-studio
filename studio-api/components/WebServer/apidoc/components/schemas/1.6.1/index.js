const config = {}

Object.assign(config, require("./organization_kpi.json"))
Object.assign(config, require("./session_kpi.json"))

if (process.env.SESSION_API_ENDPOINT !== "") {
  Object.assign(config, require("./sessions_data.json"))
}

module.exports = config
