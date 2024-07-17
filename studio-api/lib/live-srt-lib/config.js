const debug = require("debug")("lib:config")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")

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
    dotenv.config({ path: path.join(__dirname, "..", ".env") }) // loads process.env from .env file (if not specified by the system)
    // const envdefault = dotenv.parse(fs.readFileSync(path.join(__dirname, '..', '.session-envdefault'))) // default usable values
    // we want to to use the path where the project is run by using process.cwd()
    const envdefault = path.join(process.cwd(), ".session-envdefault")

    //DATABASE
    process.env.DB_HOST = ifHas(process.env.DB_HOST, envdefault.DB_HOST)
    process.env.DB_PORT = ifHas(process.env.DB_PORT, envdefault.DB_PORT)
    process.env.DB_USER = ifHas(process.env.DB_USER, envdefault.DB_USER)
    process.env.DB_PASSWORD = ifHas(
      process.env.DB_PASSWORD,
      envdefault.DB_PASSWORD,
    )
    process.env.DB_NAME = ifHas(process.env.DB_NAME, envdefault.DB_NAME)
    //APPLICATIONS
    process.env.TRANSCRIBER_COMPONENTS = ifHas(
      process.env.TRANSCRIBER_COMPONENTS,
      envdefault.TRANSCRIBER_COMPONENTS,
    ) // you might not want to change this
    process.env.SCHEDULER_COMPONENTS = ifHas(
      process.env.SCHEDULER_COMPONENTS,
      envdefault.SCHEDULER_COMPONENTS,
    ) // you might not want to change this
    process.env.SCHEDULER_WEBSERVER_HTTP_PORT = ifHas(
      process.env.SCHEDULER_WEBSERVER_HTTP_PORT,
      envdefault.SCHEDULER_WEBSERVER_HTTP_PORT,
    )
    process.env.SESSION_SCHEDULER_URL = ifHas(
      process.env.SESSION_SCHEDULER_URL,
      envdefault.SESSION_SCHEDULER_URL,
    )
    process.env.SESSION_API_COMPONENTS = ifHas(
      process.env.SESSION_API_COMPONENTS,
      envdefault.SESSION_API_COMPONENTS,
    ) // you might not want to change this
    process.env.DELIVERY_COMPONENTS = ifHas(
      process.env.DELIVERY_COMPONENTS,
      envdefault.DELIVERY_COMPONENTS,
    ) // you might not want to change this
    process.env.DELIVERY_WEBSERVER_HTTP_PORT = ifHas(
      process.env.DELIVERY_WEBSERVER_HTTP_PORT,
      envdefault.DELIVERY_WEBSERVER_HTTP_PORT,
    )
    process.env.SESSION_API_WEBSERVER_HTTP_PORT = ifHas(
      process.env.SESSION_API_WEBSERVER_HTTP_PORT,
      envdefault.SESSION_API_WEBSERVER_HTTP_PORT,
    )
    process.env.SESSION_API_HOST = ifHas(
      process.env.SESSION_API_HOST,
      envdefault.SESSION_API_HOST,
    )
    process.env.SESSION_API_PUBLIC_URL = ifHas(
      process.env.SESSION_API_PUBLIC_URL,
      envdefault.SESSION_API_PUBLIC_URL,
    )
    //TRANSCRIBER ASR
    process.env.ASR_PROVIDER = ifHas(
      process.env.ASR_PROVIDER,
      envdefault.ASR_PROVIDER,
    )
    process.env.ASR_LANGUAGE = ifHas(
      process.env.ASR_LANGUAGE,
      envdefault.ASR_LANGUAGE,
    )
    process.env.TRANSCRIBER_BOT_NAME = ifHas(
      process.env.TRANSCRIBER_BOT_NAME,
      envdefault.TRANSCRIBER_BOT_NAME,
    )
    process.env.TRANSCRIBER_RESET_MESSAGE = ifHas(
      process.env.TRANSCRIBER_RESET_MESSAGE,
      envdefault.TRANSCRIBER_RESET_MESSAGE,
    )
    //streaming server
    process.env.STREAMING_PROTOCOL = ifHas(
      process.env.STREAMING_PROTOCOL,
      envdefault.STREAMING_PROTOCOL,
    )
    process.env.STREAMING_HOST = ifHas(
      process.env.STREAMING_HOST,
      envdefault.STREAMING_HOST,
    )
    process.env.STREAMING_PROXY_HOST = ifHas(
      process.env.STREAMING_PROXY_HOST,
      envdefault.STREAMING_PROXY_HOST,
    )
    process.env.STREAMING_PROXY_PORT = ifHas(
      process.env.STREAMING_PROXY_PORT,
      envdefault.STREAMING_PROXY_PORT,
    )
    process.env.STREAMING_PASSPHRASE = ifHas(
      process.env.STREAMING_PASSPHRASE,
      envdefault.STREAMING_PASSPHRASE,
    )
    process.env.SAMPLE_RATE = ifHas(
      process.env.SAMPLE_RATE,
      envdefault.SAMPLE_RATE,
    )
    process.env.UDP_RANGE = ifHas(process.env.UDP_RANGE, envdefault.UDP_RANGE)
    process.env.SRT_MODE = ifHas(process.env.SRT_MODE, envdefault.SRT_MODE)
    process.env.BYTES_PER_SAMPLE = ifHas(
      process.env.BYTES_PER_SAMPLE,
      envdefault.BYTES_PER_SAMPLE,
    )
    process.env.MAX_AUDIO_BUFFER = ifHas(
      process.env.MAX_AUDIO_BUFFER,
      envdefault.MAX_AUDIO_BUFFER,
    )
    process.env.MIN_AUDIO_BUFFER = ifHas(
      process.env.MIN_AUDIO_BUFFER,
      envdefault.MIN_AUDIO_BUFFER,
    )
    //broker
    process.env.BROKER_HOST = ifHas(
      process.env.BROKER_HOST,
      envdefault.BROKER_HOST,
    )
    process.env.BROKER_PORT = ifHas(
      process.env.BROKER_PORT,
      envdefault.BROKER_PORT,
    )
    process.env.BROKER_USERNAME = ifHas(
      process.env.BROKER_USERNAME,
      envdefault.BROKER_USERNAME,
    )
    process.env.BROKER_PASSWORD = ifHas(
      process.env.BROKER_PASSWORD,
      envdefault.BROKER_PASSWORD,
    )
    process.env.BROKER_PROTOCOL = ifHas(
      process.env.BROKER_PROTOCOL,
      envdefault.BROKER_PROTOCOL,
    )
    process.env.BROKER_KEEPALIVE = ifHas(
      process.env.BROKER_KEEPALIVE,
      envdefault.BROKER_KEEPALIVE,
    )
    // Front end
    process.env.FRONT_END_PUBLIC_URL = ifHas(
      process.env.FRONT_END_PUBLIC_URL,
      envdefault.FRONT_END_PUBLIC_URL,
    )
    // Delivery
    process.env.DELIVERY_PUBLIC_URL = ifHas(
      process.env.DELIVERY_PUBLIC_URL,
      envdefault.DELIVERY_PUBLIC_URL,
    )
    process.env.DELIVERY_WS_PUBLIC_URL = ifHas(
      process.env.DELIVERY_WS_PUBLIC_URL,
      envdefault.DELIVERY_WS_PUBLIC_URL,
    )
    process.env.DELIVERY_SESSION_URL = ifHas(
      process.env.DELIVERY_SESSION_URL,
      envdefault.DELIVERY_SESSION_URL,
    )
    process.env.DELIVERY_ALLOWED_DOMAINS = ifHas(
      process.env.DELIVERY_ALLOWED_DOMAINS,
      envdefault.DELIVERY_ALLOWED_DOMAINS,
    )
  } catch (e) {
    console.error(debug.namespace, e)
    process.exit(1)
  }
}
module.exports = configureDefaults()
