export function testEmail(field) {
  field.valid = false
  field.error = null
  field.value = field.value.toLowerCase().trim()
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/
  if (field.value.match(regex)) {
    field.valid = true
  } else {
    field.error = "Invalid email"
  }

  return field.valid
}
