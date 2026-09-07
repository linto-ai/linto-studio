/**
 * Formats an amount in cents as a localized currency string.
 * @param {number} amountCents
 * @param {string} currency - ISO currency code (e.g. "eur")
 * @param {string} locale
 * @returns {string}
 */
export function formatCurrencyAmount(amountCents, currency = "eur", locale = "fr-FR") {
  const amount = (amountCents || 0) / 100
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount)
  } catch {
    return `${amount} ${currency.toUpperCase()}`
  }
}
