import { DEFAULT_PACK_LOOK, PACK_KIND_LOOKS } from "../const/packKinds.js"

/**
 * Color, icon and motif of a pack card, from the kind of the pack.
 * @param {string} kind - live, transcription…
 * @returns {{color: string, icon: string, motif: string}}
 */
export function computePackLook(kind) {
  return PACK_KIND_LOOKS[kind] || DEFAULT_PACK_LOOK
}
