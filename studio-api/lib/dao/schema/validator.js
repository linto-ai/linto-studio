const Validator = new (require("jsonschema").Validator)()
const logger = require(`${process.cwd()}/lib/logger/logger`)

function validateJson(jsonToValidate, schemaName) {
  try {
    if (!jsonToValidate) return false
    else if (typeof jsonToValidate !== "object")
      jsonToValidate = JSON.parse(jsonToValidate)

    const schema = require(`${process.cwd()}/lib/dao/schema/${schemaName}.json`)

    if (schema === "undefined") return false

    const validationResult = Validator.validate(jsonToValidate, schema)

    if (validationResult.errors.length === 0) {
      return true
    } else {
      validationResult.errors.forEach((error) => {
        logger.warn("Schema validation error:", error.stack)
      })

      return false
    }
  } catch (error) {
    return false
  }
}

module.exports = validateJson
