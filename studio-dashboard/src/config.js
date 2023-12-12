//const debug = require("debug")("linto:conversation-manager:config")
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
function ifHas(element, defaultValue) {
  if (!element) return defaultValue
  return element
}

function configureDefaults() {
  try {
    dotenv.config() // loads process.env from .env file (if not specified by the system)
    dotenv.config({ path: path.resolve(process.cwd(), ".envdefault") })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
export default configureDefaults()
