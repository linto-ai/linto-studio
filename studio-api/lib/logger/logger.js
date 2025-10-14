const debug = require("debug")("linto:logger")
const fs = require("fs")
const path = require("path")
const { createLogger, format, transports } = require("winston")

const configPath =
  process.env.WINSTON_CONFIG_PATH ||
  `${process.cwd()}/lib/logger/winston.config.json`
const config = JSON.parse(fs.readFileSync(configPath, "utf8"))

function buildFormat(transportOptions) {
  const useJson =
    (transportOptions && transportOptions.format === "json") ||
    config.format === "json"
  return useJson
    ? format.combine(format.timestamp(), format.json())
    : format.combine(
        transportOptions?.colorize || config.colorize
          ? format.colorize()
          : format.uncolorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : ""
          return `${timestamp} [${level}]: ${message}${metaString}`
        }),
      )
}

const loggerTransports = config.transports
  .map((t) => {
    const baseOpts = { level: t.options.level || config.level || "info" }
    switch (t.type) {
      case "console":
        return new transports.Console({
          ...baseOpts,
          ...t.options,
          format: buildFormat(t.options),
        })
      case "file":
        return new transports.File({
          ...baseOpts,
          ...t.options,
          format: buildFormat(t.options),
        })
      case "http":
        return new transports.Http({
          ...baseOpts,
          ...t.options,
          format: buildFormat(t.options),
        })
      default:
        console.warn(`⚠️ Unknown transport: ${t.type}`)
        return null
    }
  })
  .filter(Boolean)

try {
  const logger = createLogger({
    level: config.level || "info",
    transports: loggerTransports,
  })

  module.exports = logger
} catch (err) {
  console.error("Logger initialization failed:", err)
  process.exit(1)
}
