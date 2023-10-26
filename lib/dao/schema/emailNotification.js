const Validator = new (require('jsonschema').Validator)

function validateJsonEmailNotification(jsonToValidate) {
  try {
    if(!jsonToValidate) return false
    else if(typeof jsonToValidate !== 'object') jsonToValidate = JSON.parse(jsonToValidate)
    
    const validationResult = Validator.validate(jsonToValidate, require(`${process.cwd()}/lib/dao/schema/emailNotification.json`))

    if (validationResult.errors.length === 0) {
      return true
    } else {
      validationResult.errors.forEach((error) => {
        console.log(error.stack)
      })

      return false
    }
  } catch (error) {
    return false
  }
}

module.exports = validateJsonEmailNotification 