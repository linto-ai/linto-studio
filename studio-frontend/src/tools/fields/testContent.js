export function testContent(field, testEmpty = false) {
  field.error = null
  field.valid = false
  field.value = field.value.trim()
  if (field.value.length === 0) {
    if (testEmpty) {
      field.error = "This field is required"
    } else {
      field.valid = true
    }
  } else {
    if (field.value.indexOf(">") >= 0 || field.value.indexOf("<") >= 0) {
      field.error = "Unauthorized caracters"
    } else {
      field.valid = true
    }
  }
  return field.valid
}
