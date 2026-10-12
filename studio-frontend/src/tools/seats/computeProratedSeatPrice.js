function toTime(value) {
  if (!value) return null
  const time = value instanceof Date ? value.getTime() : Date.parse(value)
  return Number.isNaN(time) ? null : time
}

/**
 * What is billed today for seats added in the middle of a billing period.
 *
 * An ESTIMATE, and only that: Stripe prorates to the second and applies taxes
 * and discounts of its own (the subscription is updated with
 * proration_behavior "always_invoice", so the difference is invoiced at once).
 * The caller must present the figure as approximate.
 *
 * @param {{unitCents: number, quantity: number, periodStart: string|Date, periodEnd: string|Date, now: Date}} params
 * @returns {{amountCents: number, ratio: number}|null} null when the period is unknown
 */
export function computeProratedSeatPrice({
  unitCents,
  quantity,
  periodStart,
  periodEnd,
  now,
}) {
  const start = toTime(periodStart)
  const end = toTime(periodEnd)
  const current = toTime(now)
  if (start === null || end === null || current === null) return null
  if (end <= start) return null

  const ratio = Math.min(1, Math.max(0, (end - current) / (end - start)))
  return {
    ratio,
    amountCents: Math.round((unitCents || 0) * (quantity || 0) * ratio),
  }
}
