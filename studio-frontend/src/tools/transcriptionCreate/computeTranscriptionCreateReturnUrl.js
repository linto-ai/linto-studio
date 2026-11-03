import { TRANSCRIPTION_CREATE_QUERY_PARAM } from "../../const/transcriptionCreate.js"
import { computeCheckoutReturnUrl } from "../billing/computeCheckoutReturnUrl.js"

/**
 * Where Stripe should send the browser back after a purchase made from the
 * modal: the current page, with the modal open again.
 * @param {string} href
 * @returns {string}
 */
export function computeTranscriptionCreateReturnUrl(href) {
  const url = new URL(computeCheckoutReturnUrl(href))
  url.searchParams.set(TRANSCRIPTION_CREATE_QUERY_PARAM, "1")
  return url.toString()
}
