const { createException } = require("./base")

// SaaS gating errors. `code` is surfaced to the front-end (handler copies it),
// which maps it to the "Passer pro" upgrade CTA. Extras (reason, capability,
// remaining) are attached via the createException(message, extras) form.
const SaasQuotaExceeded = createException(
  "SaasQuotaExceeded",
  "saas",
  402, // Payment Required -> "credite / passe pro"
  "Quota exceeded for your plan",
  "SAAS_QUOTA_EXCEEDED",
)

const SaasFeatureLocked = createException(
  "SaasFeatureLocked",
  "saas",
  403,
  "This feature is not available on your plan",
  "SAAS_FEATURE_LOCKED",
)

module.exports = { SaasQuotaExceeded, SaasFeatureLocked }
