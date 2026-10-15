import { PACK_KIND_PITCHES } from "../../../const/pack/packKindPitches.js"
import { computePackGroups } from "./computePackGroups.js"
import { computePackLook } from "./computePackLook.js"
import { computePackPalette } from "./computePackPalette.js"

/**
 * Groups of the purchase modal, ready to render: the packs of each kind (see
 * computePackGroups) with the i18n keys of the kind name, of its headline
 * and counting note, its features, its color palette, and the AI credits
 * every pack of the group comes with (null when they differ or there are
 * none). A kind without a pitch gets no name, no headline, no features and
 * no note.
 * @param {Array<{packKey: string, kind: string, minutes: number, amountCents: number}>} packs
 * @returns {Array<{kind: string, packs: Array, titleKey: string|null, headlineKey: string|null, features: Array, noteKey: string|null, palette: object, aiCredits: number|null}>}
 */
export function computePackOfferGroups(packs) {
  return computePackGroups(packs).map(computePackOfferGroup)
}

function computePackOfferGroup(group) {
  const pitch = PACK_KIND_PITCHES[group.kind]
  return {
    ...group,
    titleKey: pitch?.titleKey ?? null,
    headlineKey: pitch?.headlineKey ?? null,
    features: pitch?.features ?? [],
    noteKey: pitch?.noteKey ?? null,
    palette: computePackPalette(computePackLook(group.kind).color),
    aiCredits: computeSharedAiCredits(group.packs),
  }
}

function computeSharedAiCredits(packs) {
  const credits = new Set(packs.map((pack) => pack.aiCredits || 0))
  const [shared] = credits
  return credits.size === 1 && shared > 0 ? shared : null
}
