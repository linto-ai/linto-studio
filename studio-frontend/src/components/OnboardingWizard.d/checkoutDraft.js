// What the wizard needs to resume after the Stripe round-trip (full page
// reload): the chosen plan and, for Business, the organization being bought.
const STORAGE_KEY = "onboardingCheckoutDraft"

export function writeCheckoutDraft(draft) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch (error) {
    console.error(error)
  }
}

export function readCheckoutDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function clearCheckoutDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error(error)
  }
}
