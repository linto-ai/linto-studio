import EMPTY_FIELD from "../const/emptyField.js"

export default function jsonSchemaToFields(jsonSchema, lang = "en") {
  const fields = []
  for (const key in jsonSchema.properties) {
    const field = {
      ...EMPTY_FIELD,
      label: extract_title_with_locales(jsonSchema, key, lang),
      type: convert_type(jsonSchema.properties[key].type),
      required: jsonSchema?.required?.includes(key) || false,
      key: key,
    }
    fields.push(field)
  }
  return fields
}

function extract_title_with_locales(jsonSchema, key, lang) {
  return (
    jsonSchema.properties[key][`title_${lang}`] ||
    jsonSchema.properties[key].title
  )
}

function convert_type(type) {
  switch (type) {
    case "string":
      return "text"
    case "number":
      return "number"
    default:
      return "text"
  }
}
