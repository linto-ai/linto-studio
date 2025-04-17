export function testPasswordConfirm(field, password, t) {
  field.valid = false
  field.error = null
  field.value = field.value.trim()
  if (field.value.length === 0) {
    field.error = t("error.required")
  } else if (field.value !== password) {
    field.error = t("error.passwordsMustBeTheSame")
  } else {
    field.valid = true
  }
}
