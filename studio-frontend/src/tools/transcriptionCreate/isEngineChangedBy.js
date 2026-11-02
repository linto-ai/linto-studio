import { reconcileDraft } from "./reconcileDraft.js"

/**
 * Whether a change to the draft would make it land on another engine.
 * @param {object} draft
 * @param {object} change - fields of the draft to change
 * @param {object} catalog - see reconcileDraft
 * @returns {boolean}
 */
export function isEngineChangedBy(draft, change, catalog) {
  const next = reconcileDraft({ ...draft, ...change }, catalog).draft
  return (
    next.profileId !== draft.profileId || next.serviceName !== draft.serviceName
  )
}
