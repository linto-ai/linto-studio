import dotenv from "dotenv"
import fs from "fs"

function ifHas(element, defaultValue) {
  if (!element) return defaultValue
  return element
}

export function configureDefaults() {
  try {
    dotenv.config() // loads process.env from .env file (if not specified by the system)
    const envdefault = dotenv.parse(fs.readFileSync(".envdefault")) // default usable values

    // Dev variable
    process.env.COMPONENTS = ifHas(
      process.env.COMPONENTS,
      envdefault.COMPONENTS
    )
    process.env.WEBSERVER_HTTP_PORT = ifHas(
      process.env.WEBSERVER_HTTP_PORT,
      envdefault.WEBSERVER_HTTP_PORT
    )
    process.env.API_HOST = ifHas(process.env.API_HOST, envdefault.API_HOST)
  } catch (e) {
    console.error(debug.namespace, e)
    process.exit(1)
  }
}
