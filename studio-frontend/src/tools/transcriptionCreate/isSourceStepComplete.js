import { isValidUrl } from "../isValidUrl.js"

/**
 * Whether the first step holds what its source needs to go further.
 * @param {object} draft
 * @param {object[]} files - the files and URLs picked for the "file" source
 * @returns {boolean}
 */
export function isSourceStepComplete(draft, files) {
  if (draft.source === "file") return files.length > 0
  if (draft.source === "visio") {
    return isValidUrl(draft.visio.url) && Boolean(draft.visio.provider)
  }
  return true
}
