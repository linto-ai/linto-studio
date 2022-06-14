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
        process.env.LOGGER_ENABLED = ifHas(process.env.LOGGER_ENABLED, envdefault.LOGGER_ENABLED)
        process.env.DEBUG = ifHas(process.env.DEBUG, envdefault.DEBUG)

        // Webserver Settings
        process.env.COMPONENTS = ifHas(process.env.COMPONENTS, envdefault.COMPONENTS)
        process.env.WEBSERVER_HTTP_PORT = ifHas(process.env.WEBSERVER_HTTP_PORT, envdefault.WEBSERVER_HTTP_PORT)
        process.env.SESSION_SECRET = ifHas(process.env.SESSION_SECRET, envdefault.SESSION_SECRET)
        process.env.USE_SSL = ifHas(process.env.USE_SSL, envdefault.USE_SSL)

        // Mongo
        process.env.DB_DRIVER = ifHas(process.env.DB_DRIVER, envdefault.DB_DRIVER)
        process.env.DB_HOST = ifHas(process.env.DB_HOST, envdefault.DB_HOST)
        process.env.DB_USER = ifHas(process.env.DB_USER, envdefault.DB_USER)
        process.env.DB_PASS = ifHas(process.env.DB_PASS, envdefault.DB_PASS)
        process.env.DB_PORT = ifHas(process.env.DB_PORT, envdefault.DB_PORT)
        process.env.DB_NAME = ifHas(process.env.DB_NAME, envdefault.DB_NAME)
        process.env.DB_REQUIRE_LOGIN = ifHas(process.env.DB_REQUIRE_LOGIN, envdefault.DB_REQUIRE_LOGIN)

        // Cross domain accessibility
        process.env.CORS_ENABLED = ifHas(process.env.CORS_ENABLED, envdefault.CORS_ENABLED)
        process.env.CORS_API_WHITELIST = ifHas(process.env.CORS_API_WHITELIST, envdefault.CORS_API_WHITELIST)

        // Express settings
        process.env.EXPRESS_SIZE_FILE_MAX = ifHas(process.env.EXPRESS_SIZE_FILE_MAX, envdefault.EXPRESS_SIZE_FILE_MAX)
        process.env.EXPRESS_TIMEOUT = ifHas(process.env.EXPRESS_TIMEOUT, envdefault.EXPRESS_TIMEOUT)


        process.env.STT_USER = ifHas(process.env.STT_USER, envdefault.STT_USER)
        process.env.STT_PASSWORD = ifHas(process.env.STT_PASSWORD, envdefault.STT_PASSWORD)
        process.env.STT_HOST = ifHas(process.env.STT_HOST, envdefault.STT_HOST)
        process.env.STT_REQUIRE_AUTH = ifHas(process.env.STT_REQUIRE_AUTH, envdefault.STT_REQUIRE_AUTH)

        process.env.STT_RESULT_CONVERT_NUMBERS = ifHas(process.env.STT_RESULT_CONVERT_NUMBERS, envdefault.STT_RESULT_CONVERT_NUMBERS)
        process.env.STT_RESULT_RETURN_RAW  = ifHas(process.env.STT_RESULT_RETURN_RAW, envdefault.STT_RESULT_RETURN_RAW)


        // Storage folder for uploads
        process.env.VOLUME_AUDIO_UPLOAD_PATH = ifHas(process.env.VOLUME_AUDIO_UPLOAD_PATH, envdefault.VOLUME_AUDIO_UPLOAD_PATH)
        process.env.VOLUME_AUDIO_PUBLIC_PATH = ifHas(process.env.VOLUME_AUDIO_PUBLIC_PATH, envdefault.VOLUME_AUDIO_PUBLIC_PATH)
        process.env.VOLUME_PROFILE_PICTURE_UPLOAD_PATH = ifHas(process.env.VOLUME_PROFILE_PICTURE_UPLOAD_PATH, envdefault.VOLUME_PROFILE_PICTURE_UPLOAD_PATH)
        process.env.VOLUME_PROFILE_PICTURE_PUBLIC_PATH = ifHas(process.env.VOLUME_PROFILE_PICTURE_PUBLIC_PATH, envdefault.VOLUME_PROFILE_PICTURE_PUBLIC_PATH)

        // Passeport settings
        process.env.CM_JWT_SECRET = ifHas(process.env.CM_JWT_SECRET, envdefault.CM_JWT_SECRET)
        process.env.CM_REFRESH_SECRET = ifHas(process.env.CM_REFRESH_SECRET, envdefault.CM_REFRESH_SECRET)

    } catch (e) {
        console.error(debug.namespace, e)
        process.exit(1)
    }
}
module.exports = configureDefaults()