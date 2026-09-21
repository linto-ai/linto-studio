/**
 * Where Stripe should send the browser back: the current page, without the
 * status parameters a previous checkout round-trip may have left.
 * @param {string} href
 * @returns {string}
 */
export function computeCheckoutReturnUrl(href) {
  const url = new URL(href)
  url.searchParams.delete("type")
  url.searchParams.delete("status")
  return url.toString()
}
