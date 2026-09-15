import { isValidEmail } from "../../tools/isValidEmail.js"

/**
 * Whether the share sheet offers to invite the typed address: it must be an
 * email that neither the search results nor the current sharing know.
 * @param {string} search
 * @param {{ email?: string }[]} results
 * @param {{ email?: string }[]} sharedUsers
 * @returns {boolean}
 */
export function shouldOfferInvite(search, results, sharedUsers) {
  const email = search.trim().toLowerCase()
  if (!isValidEmail(email)) return false
  const known = [...results, ...sharedUsers].some(
    (user) => user.email?.toLowerCase() === email,
  )
  return !known
}
