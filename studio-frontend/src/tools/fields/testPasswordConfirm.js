export function testPasswordConfirm(field, password, t) {
  field.valid = false
  field.error = null
  if (field.value.length === 0) {
    field.error = t("error.required")
  } else if (field.value !== password?.value) {
    field.error = t("error.passwordsMustBeTheSame")
  } else {
    field.valid = true
  }
}
