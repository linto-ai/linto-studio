const SAAS_REFUSAL_CODES = ["SAAS_QUOTA_EXCEEDED", "SAAS_FEATURE_LOCKED"]

/**
 * Is this response body a SaaS refusal from studio-api (quota exceeded, live
 * credit exhausted, feature locked…)?
 * @param {object|null} errorData - response body of a failed request
 * @returns {boolean}
 */
export function isSaasRefusal(errorData) {
  return SAAS_REFUSAL_CODES.includes(errorData?.code)
}
