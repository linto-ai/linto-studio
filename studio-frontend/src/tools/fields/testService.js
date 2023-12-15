export function testService(field, t) {
  field.error = null
  if (field.value) {
    field.valid = true
  } else {
    field.valid = false
    field.error = t("conversation.transcription_service_error")
  }

  return field.valid
}
