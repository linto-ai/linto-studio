import { SETTINGS_QUERY_PARAM } from "../const/settingsQueryParam.js"
import { computeCheckoutReturnUrl } from "./computeCheckoutReturnUrl.js"

/**
 * Where Stripe (Checkout or Customer Portal) should send the browser back
 * from the billing settings tab: the current page, reopening that tab. The
 * router consumes the settings parameter and keeps the others, so the type
 * and status Stripe appends are still there for the tab to read.
 * @param {string} href
 * @returns {string}
 */
export function computeBillingReturnUrl(href) {
  const url = new URL(computeCheckoutReturnUrl(href))
  url.searchParams.set(SETTINGS_QUERY_PARAM, "billing")
  return url.toString()
}
