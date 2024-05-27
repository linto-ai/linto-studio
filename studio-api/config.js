const debug = require('debug')('linto:conversation-manager:config')
const dotenv = require('dotenv')
const fs = require('fs')

function ifHas(element, defaultValue) {
    if (!element) return defaultValue
    return element
}

function configureDefaults() {
    try {
        dotenv.config() // loads process.env from .env file (if not specified by the system)
        const envdefault = dotenv.parse(fs.readFileSync('.envdefault')) // default usable values

        // Webserver Settings
        process.env.COMPONENTS = ifHas(process.env.COMPONENTS, envdefault.COMPONENTS)
        process.env.WEBSERVER_HTTP_PORT = ifHas(process.env.WEBSERVER_HTTP_PORT, envdefault.WEBSERVER_HTTP_PORT)

        // Mongo
        process.env.DB_HOST_MONGO = ifHas(process.env.DB_HOST_MONGO, envdefault.DB_HOST_MONGO)
        process.env.DB_USER_MONGO = ifHas(process.env.DB_USER_MONGO, envdefault.DB_USER_MONGO)
        process.env.DB_PASS_MONGO = ifHas(process.env.DB_PASS_MONGO, envdefault.DB_PASS_MONGO)
        process.env.DB_PORT_MONGO = ifHas(process.env.DB_PORT_MONGO, envdefault.DB_PORT_MONGO)
        process.env.DB_NAME_MONGO = ifHas(process.env.DB_NAME_MONGO, envdefault.DB_NAME_MONGO)
        process.env.DB_REQUIRE_LOGIN = ifHas(process.env.DB_REQUIRE_LOGIN_MONGO, envdefault.DB_REQUIRE_LOGIN_MONGO)

        // Cross domain accessibility
        process.env.CORS_ENABLED = ifHas(process.env.CORS_ENABLED, envdefault.CORS_ENABLED)
        process.env.CORS_API_WHITELIST = ifHas(process.env.CORS_API_WHITELIST, envdefault.CORS_API_WHITELIST)

        // Express settings
        process.env.EXPRESS_SIZE_FILE_MAX = ifHas(process.env.EXPRESS_SIZE_FILE_MAX, envdefault.EXPRESS_SIZE_FILE_MAX)
        process.env.AXIOS_SIZE_FILE_MAX = ifHas(process.env.AXIOS_SIZE_FILE_MAX, envdefault.AXIOS_SIZE_FILE_MAX)

        process.env.GATEWAY_SERVICES = ifHas(process.env.GATEWAY_SERVICES, envdefault.GATEWAY_SERVICES)
        process.env.MAX_SUBTITLE_VERSION = ifHas(process.env.MAX_SUBTITLE_VERSION, envdefault.MAX_SUBTITLE_VERSION)

        // Storage folder for uploads
        process.env.VOLUME_FOLDER = 'storages'
        process.env.VOLUME_AUDIO_PATH = 'audios'
        process.env.VOLUME_PROFILE_PICTURE_PATH = 'pictures'
        process.env.VOLUME_AUDIO_WAVEFORM_PATH = 'audiowaveform'

        // Passeport settings
        process.env.CM_JWT_SECRET = ifHas(process.env.CM_JWT_SECRET, envdefault.CM_JWT_SECRET)
        process.env.CM_REFRESH_SECRET = ifHas(process.env.CM_REFRESH_SECRET, envdefault.CM_REFRESH_SECRET)

        process.env.DISABLE_USER_CREATION = ifHas(process.env.DISABLE_USER_CREATION, envdefault.DISABLE_USER_CREATION)

        process.env.ENABLE_SESSION_API = ifHas(process.env.ENABLE_SESSION_API, envdefault.ENABLE_SESSION_API)
        if (process.env.ENABLE_SESSION_API === "true") {

            const envdefaultSession = dotenv.parse(fs.readFileSync('.session-envdefault')) // default usable values

            //DATABASE
            process.env.DB_HOST = ifHas(process.env.DB_HOST, envdefaultSession.DB_HOST)
            process.env.DB_PORT = ifHas(process.env.DB_PORT, envdefaultSession.DB_PORT)
            process.env.DB_USER = ifHas(process.env.DB_USER, envdefaultSession.DB_USER)
            process.env.DB_PASSWORD = ifHas(process.env.DB_PASSWORD, envdefaultSession.DB_PASSWORD)
            process.env.DB_NAME = ifHas(process.env.DB_NAME, envdefaultSession.DB_NAME)
            //APPLICATIONS
            process.env.TRANSCRIBER_COMPONENTS = ifHas(process.env.TRANSCRIBER_COMPONENTS, envdefaultSession.TRANSCRIBER_COMPONENTS) // you might not want to change this
            process.env.SCHEDULER_COMPONENTS = ifHas(process.env.SCHEDULER_COMPONENTS, envdefaultSession.SCHEDULER_COMPONENTS) // you might not want to change this
            process.env.SCHEDULER_WEBSERVER_HTTP_PORT = ifHas(process.env.SCHEDULER_WEBSERVER_HTTP_PORT, envdefaultSession.SCHEDULER_WEBSERVER_HTTP_PORT)
            process.env.SESSION_SCHEDULER_URL = ifHas(process.env.SESSION_SCHEDULER_URL, envdefaultSession.SESSION_SCHEDULER_URL)
            process.env.SESSION_API_COMPONENTS = ifHas(process.env.SESSION_API_COMPONENTS, envdefaultSession.SESSION_API_COMPONENTS) // you might not want to change this
            process.env.DELIVERY_COMPONENTS = ifHas(process.env.DELIVERY_COMPONENTS, envdefaultSession.DELIVERY_COMPONENTS) // you might not want to change this
            process.env.DELIVERY_WEBSERVER_HTTP_PORT = ifHas(process.env.DELIVERY_WEBSERVER_HTTP_PORT, envdefaultSession.DELIVERY_WEBSERVER_HTTP_PORT)
            process.env.SESSION_API_WEBSERVER_HTTP_PORT = ifHas(process.env.SESSION_API_WEBSERVER_HTTP_PORT, envdefaultSession.SESSION_API_WEBSERVER_HTTP_PORT)
            process.env.SESSION_API_HOST = ifHas(process.env.SESSION_API_HOST, envdefaultSession.SESSION_API_HOST)
            process.env.SESSION_API_PUBLIC_URL = ifHas(process.env.SESSION_API_PUBLIC_URL, envdefaultSession.SESSION_API_PUBLIC_URL)
            //TRANSCRIBER ASR
            process.env.ASR_PROVIDER = ifHas(process.env.ASR_PROVIDER, envdefaultSession.ASR_PROVIDER)
            process.env.ASR_LANGUAGE = ifHas(process.env.ASR_LANGUAGE, envdefaultSession.ASR_LANGUAGE)
            process.env.TRANSCRIBER_BOT_NAME = ifHas(process.env.TRANSCRIBER_BOT_NAME, envdefaultSession.TRANSCRIBER_BOT_NAME)
            process.env.TRANSCRIBER_RESET_MESSAGE = ifHas(process.env.TRANSCRIBER_RESET_MESSAGE, envdefaultSession.TRANSCRIBER_RESET_MESSAGE)
            //streaming server
            process.env.STREAMING_PROTOCOL = ifHas(process.env.STREAMING_PROTOCOL, envdefaultSession.STREAMING_PROTOCOL)
            process.env.STREAMING_HOST = ifHas(process.env.STREAMING_HOST, envdefaultSession.STREAMING_HOST)
            process.env.STREAMING_PROXY_HOST = ifHas(process.env.STREAMING_PROXY_HOST, envdefaultSession.STREAMING_PROXY_HOST)
            process.env.STREAMING_PROXY_PORT = ifHas(process.env.STREAMING_PROXY_PORT, envdefaultSession.STREAMING_PROXY_PORT)
            process.env.STREAMING_PASSPHRASE = ifHas(process.env.STREAMING_PASSPHRASE, envdefaultSession.STREAMING_PASSPHRASE)
            process.env.SAMPLE_RATE = ifHas(process.env.SAMPLE_RATE, envdefaultSession.SAMPLE_RATE)
            process.env.UDP_RANGE = ifHas(process.env.UDP_RANGE, envdefaultSession.UDP_RANGE)
            process.env.SRT_MODE = ifHas(process.env.SRT_MODE, envdefaultSession.SRT_MODE)
            process.env.BYTES_PER_SAMPLE = ifHas(process.env.BYTES_PER_SAMPLE, envdefaultSession.BYTES_PER_SAMPLE)
            process.env.MAX_AUDIO_BUFFER = ifHas(process.env.MAX_AUDIO_BUFFER, envdefaultSession.MAX_AUDIO_BUFFER)
            process.env.MIN_AUDIO_BUFFER = ifHas(process.env.MIN_AUDIO_BUFFER, envdefaultSession.MIN_AUDIO_BUFFER)
            //broker
            process.env.BROKER_HOST = ifHas(process.env.BROKER_HOST, envdefaultSession.BROKER_HOST)
            process.env.BROKER_PORT = ifHas(process.env.BROKER_PORT, envdefaultSession.BROKER_PORT)
            process.env.BROKER_USERNAME = ifHas(process.env.BROKER_USERNAME, envdefaultSession.BROKER_USERNAME)
            process.env.BROKER_PASSWORD = ifHas(process.env.BROKER_PASSWORD, envdefaultSession.BROKER_PASSWORD)
            process.env.BROKER_PROTOCOL = ifHas(process.env.BROKER_PROTOCOL, envdefaultSession.BROKER_PROTOCOL)
            process.env.BROKER_KEEPALIVE = ifHas(process.env.BROKER_KEEPALIVE, envdefaultSession.BROKER_KEEPALIVE)
            // Front end
            process.env.FRONT_END_PUBLIC_URL = ifHas(process.env.FRONT_END_PUBLIC_URL, envdefaultSession.FRONT_END_PUBLIC_URL)
            // Delivery
            process.env.DELIVERY_PUBLIC_URL = ifHas(process.env.DELIVERY_PUBLIC_URL, envdefaultSession.DELIVERY_PUBLIC_URL)
            process.env.DELIVERY_WS_PUBLIC_URL = ifHas(process.env.DELIVERY_WS_PUBLIC_URL, envdefaultSession.DELIVERY_WS_PUBLIC_URL)
            process.env.DELIVERY_SESSION_URL = ifHas(process.env.DELIVERY_SESSION_URL, envdefaultSession.DELIVERY_SESSION_URL)
            process.env.DELIVERY_ALLOWED_DOMAINS = ifHas(process.env.DELIVERY_ALLOWED_DOMAINS, envdefaultSession.DELIVERY_ALLOWED_DOMAINS)
        }


    } catch (e) {
        console.error(debug.namespace, e)
        process.exit(1)
    }
}
module.exports = configureDefaults()