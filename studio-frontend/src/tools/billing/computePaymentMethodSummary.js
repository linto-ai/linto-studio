// Stripe card brand codes and how card issuers write them.
const CARD_BRAND_LABELS = {
  amex: "American Express",
  cartes_bancaires: "Cartes Bancaires",
  diners: "Diners Club",
  discover: "Discover",
  eftpos_au: "eftpos",
  jcb: "JCB",
  mastercard: "Mastercard",
  unionpay: "UnionPay",
  visa: "Visa",
}

/**
 * Display-ready parts of the payment method of GET /cloud/billing. Card
 * brands are proper names, left untranslated; the caller labels the other
 * payment method types.
 * @param {{type: string, brand: string|null, last4: string|null, expMonth: number|null, expYear: number|null}|null} paymentMethod
 * @returns {{type: string, brandLabel: string|null, last4: string|null, expiry: string|null}|null}
 */
export function computePaymentMethodSummary(paymentMethod) {
  if (!paymentMethod) return null
  return {
    type: paymentMethod.type,
    brandLabel: computeCardBrandLabel(paymentMethod.brand),
    last4: paymentMethod.last4 || null,
    expiry: computeCardExpiry(paymentMethod.expMonth, paymentMethod.expYear),
  }
}

function computeCardBrandLabel(brand) {
  if (!brand || brand === "unknown") return null
  return (
    CARD_BRAND_LABELS[brand] || brand.charAt(0).toUpperCase() + brand.slice(1)
  )
}

// "04/2027", as printed on the card
function computeCardExpiry(month, year) {
  if (!month || !year) return null
  return `${String(month).padStart(2, "0")}/${year}`
}
