import store from "@/mobile/store.js"
import { MOBILE_BASE } from "@/mobile/const/appTarget.js"
import { saveInstance } from "@/mobile/services/native/instanceStorage.js"
import { normalizeInstanceAddress } from "@/mobile/tools/normalizeInstanceAddress.js"
import { listInstanceBaseCandidates } from "@/mobile/tools/listInstanceBaseCandidates.js"
import { logout } from "@/tools/auth/logout"

const PROBE_TIMEOUT_MS = 8000

/**
 * Finds where the API of the instance at `input` lives: GET /auth/list is
 * public and answers a JSON array, where a front or another site answers
 * HTML. A CORS refusal looks like an unreachable instance.
 * @param {string} input - the address the user typed
 * @returns {Promise<{ ok: true, instance: { address: string, base: string } }
 *   | { ok: false, reason: "invalid" | "unreachable" }>}
 */
export async function findInstance(input) {
  const address = normalizeInstanceAddress(input)
  if (!address) return { ok: false, reason: "invalid" }
  for (const base of listInstanceBaseCandidates(address)) {
    if (await answersLoginMethods(base)) {
      return { ok: true, instance: { address, base } }
    }
  }
  return { ok: false, reason: "unreachable" }
}

// Recordings that are not on the server yet: changing instance loses them.
export async function countUnsentRecordings() {
  await loadRecordings()
  return store.getters["mobileRecordings/unsentCount"]
}

// The queue and the session belong to the instance being left: both are
// cleared, then the app reloads on the new instance's login page.
export async function switchInstance(instance) {
  await loadRecordings()
  await store.dispatch("mobileRecordings/removeAll")
  logout({ redirect: false })
  saveInstance(instance)
  window.location.replace(`${MOBILE_BASE}login`)
}

async function loadRecordings() {
  if (!store.state.mobileRecordings.loaded) {
    await store.dispatch("mobileRecordings/load")
  }
}

async function answersLoginMethods(base) {
  try {
    const response = await fetch(`${base}/auth/list`, {
      credentials: "omit",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    })
    if (!response.ok) return false
    return Array.isArray(await response.json())
  } catch {
    return false
  }
}
