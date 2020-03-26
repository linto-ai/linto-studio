const debug = require('debug')('app:config')
const dotenv = require('dotenv')
const fs = require('fs')

function ifHasNotThrow(element, error) {
    if (!element) throw error
    return element
}

function ifHas(element, defaultValue) {
    if (!element) return defaultValue
    return element
}

function configureDefaults() {
    try {
        dotenv.config() // loads process.env from .env file (if not specified by the system)
        const envdefault = dotenv.parse(fs.readFileSync('.envdefault')) // default usable values
        process.env.COMPONENTS = ifHas(process.env.COMPONENTS, envdefault.COMPONENTS)
        process.env.WEBSERVER_HTTP_PORT = ifHas(process.env.WEBSERVER_HTTP_PORT, envdefault.WEBSERVER_HTTP_PORT)
        process.env.DB_DRIVER = ifHas(process.env.DB_DRIVER, envdefault.DB_DRIVER)
        process.env.DB_HOST = ifHas(process.env.DB_HOST, envdefault.DB_HOST)
        process.env.DB_USER = ifHas(process.env.DB_USER, envdefault.DB_USER)
        process.env.DB_PASS = ifHas(process.env.DB_PASS, envdefault.DB_PASS)
        process.env.DB_PORT = ifHas(process.env.DB_PORT, envdefault.DB_PORT)
        process.env.DB_NAME = ifHas(process.env.DB_NAME, envdefault.DB_NAME)
        process.env.DB_REQUIRE_LOGIN = ifHas(process.env.DB_REQUIRE_LOGIN, envdefault.DB_REQUIRE_LOGIN)
        process.env.COMPONENTS = ifHasNotThrow(process.env.COMPONENTS, Error("No COMPONENTS envvar specified"))
    } catch (e) {
        console.error(debug.namespace, e)
        process.exit(1)
    }
}
module.exports = configureDefaults()