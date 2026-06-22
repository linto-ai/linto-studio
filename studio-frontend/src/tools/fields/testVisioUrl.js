import { getEnv } from "../getEnv"

// Per-provider URL allowlist env. An unset/empty allowlist accepts any URL
// (the same permissive default the single-provider version had). Defaults to
// jitsi for back-compat when no provider is passed.
const ACCEPTED_URLS_ENV = {
  jitsi: "VUE_APP_ACCEPTED_JITSI_URLS",
  bigbluebutton: "VUE_APP_ACCEPTED_BBB_URLS",
  teams: "VUE_APP_ACCEPTED_TEAMS_URLS",
  visio: "VUE_APP_ACCEPTED_VISIO_URLS",
}

export function testVisioUrl(field, t, provider = "jitsi") {
  const acceptedUrlsStrings = getEnv(
    ACCEPTED_URLS_ENV[provider] || ACCEPTED_URLS_ENV.jitsi,
  )

  let acceptedUrls = []
  if (acceptedUrlsStrings) {
    acceptedUrls = acceptedUrlsStrings.split(",")
  }

  field.error = null
  field.valid = false
  field.value = field.value.toLowerCase().trim()

  if (field.value === "") {
    field.error = t("error.required")
    return false
  }

  if (acceptedUrls.length === 0) {
    field.valid = true
    return field.valid
  }

  if (acceptedUrls.some((url) => field.value.includes(url))) {
    field.valid = true
    return field.valid
  }

  field.error = t("error.invalidVisioUrl")

  return field.valid
}
