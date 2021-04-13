const debug = require('debug')('linto:conversation-manager:config')
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

        // Dev variable
        process.env.DEV_DISABLE_AUTH = ifHas(process.env.DEV_DISABLE_AUTH, envdefault.DEV_DISABLE_AUTH)

        // Env variable
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
        process.env.JWT_SECRET = ifHas(process.env.JWT_SECRET, envdefault.JWT_SECRET)

        process.env.CORS_ENABLED = ifHas(process.env.CORS_ENABLED, envdefault.CORS_ENABLED)
        process.env.CORS_API_WHITELIST = ifHas(process.env.CORS_API_WHITELIST, envdefault.CORS_API_WHITELIST)

        process.env.STT_USER = ifHas(process.env.STT_USER, envdefault.STT_USER)
        process.env.STT_PASSWORD = ifHas(process.env.STT_PASSWORD, envdefault.STT_PASSWORD)
        process.env.STT_HOST = ifHas(process.env.STT_HOST, envdefault.STT_HOST)
        process.env.STT_REQUIRE_AUTH = ifHas(process.env.STT_REQUIRE_AUTH, envdefault.STT_REQUIRE_AUTH)

        process.env.EXPRESS_SIZE_FILE_MAX = ifHas(process.env.EXPRESS_SIZE_FILE_MAX, envdefault.EXPRESS_SIZE_FILE_MAX)
        process.env.EXPRESS_TIMEOUT = ifHas(process.env.EXPRESS_TIMEOUT, envdefault.EXPRESS_TIMEOUT)

        process.env.VOLUME_AUDIO_LOCATION = ifHas(process.env.VOLUME_AUDIO_LOCATION, envdefault.VOLUME_AUDIO_LOCATION)
        process.env.VOLUME_PROFILE_PICTURE_LOCATION = ifHas(process.env.VOLUME_PROFILE_PICTURE_LOCATION, envdefault.VOLUME_PROFILE_PICTURE_LOCATION)

        process.env.LINTO_STACK_CM_JWT_SECRET = ifHas(process.env.LINTO_STACK_CM_JWT_SECRET, envdefault.LINTO_STACK_CM_JWT_SECRET)
        process.env.LINTO_STACK_CM_REFRESH_SECRET = ifHas(process.env.LINTO_STACK_CM_REFRESH_SECRET, envdefault.LINTO_STACK_CM_REFRESH_SECRET)
    } catch (e) {
        console.error(debug.namespace, e)
        process.exit(1)
    }
}
module.exports = configureDefaults()