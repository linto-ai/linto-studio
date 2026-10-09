import { computePackGroups } from "./computePackGroups.js"

/**
 * One offer per kind of pack (live, transcription…), in catalog order: the
 * smallest pack of the kind as its entry price, and the lowest hourly price
 * of the kind.
 * Catalog figures: the amount charged is still Stripe's.
 * @param {Array<{packKey: string, kind: string, minutes: number, amountCents: number}>} packs
 * @returns {Array<{kind: string, pack: object, lowestHourlyCents: number}>}
 */
export function computePackKindOffers(packs) {
  return computePackGroups(packs).map((group) => ({
    kind: group.kind,
    pack: group.packs[0],
    lowestHourlyCents: Math.min(...group.packs.map((pack) => pack.hourlyCents)),
  }))
}
