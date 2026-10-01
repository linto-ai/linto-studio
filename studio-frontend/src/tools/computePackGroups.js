/**
 * Packs of the purchase modal, grouped by kind (live, transcription…) in the
 * order the kinds first appear, each pack with its hourly price and, when it
 * beats the dearest hourly price of its group, the saving in percent. The
 * hourly price is a catalog figure shown to compare packs: the amount charged
 * is still Stripe's (tax added at checkout).
 * @param {Array<{packKey: string, kind: string, minutes: number, amountCents: number}>} packs
 * @returns {Array<{kind: string, packs: Array}>} groups, packs sorted by minutes
 */
export function computePackGroups(packs) {
  if (!Array.isArray(packs)) return []
  const kinds = [...new Set(packs.map((pack) => pack.kind))]
  return kinds.map((kind) => ({
    kind,
    packs: computeGroupPacks(packs.filter((pack) => pack.kind === kind)),
  }))
}

function computeGroupPacks(packs) {
  const sorted = [...packs].sort((a, b) => a.minutes - b.minutes)
  const hourlyPrices = sorted.map(computeHourlyCents)
  const dearestHourlyCents = Math.max(...hourlyPrices)
  return sorted.map((pack, index) => ({
    ...pack,
    hourlyCents: hourlyPrices[index],
    savingPercent: computeSavingPercent(
      hourlyPrices[index],
      dearestHourlyCents,
    ),
  }))
}

function computeHourlyCents(pack) {
  if (!pack.minutes) return pack.amountCents
  return Math.round((pack.amountCents * 60) / pack.minutes)
}

// null when there is nothing to save, so a lone pack gets no badge
function computeSavingPercent(hourlyCents, dearestHourlyCents) {
  if (!dearestHourlyCents || hourlyCents >= dearestHourlyCents) return null
  const saving = Math.round((1 - hourlyCents / dearestHourlyCents) * 100)
  return saving > 0 ? saving : null
}
