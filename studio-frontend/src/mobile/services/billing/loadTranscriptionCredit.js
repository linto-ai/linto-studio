import { getEnv } from "@/tools/getEnv"
import { computeTranscriptionCredit } from "@/mobile/tools/computeTranscriptionCredit.js"

const STORAGE_PREFIX = "mobile.transcriptionCredit."

/**
 * The organization's transcription minutes for the Record page. Read from
 * the server and remembered on the phone; when the server cannot be read
 * (offline), the remembered value comes back with `cached: true` and the
 * time it was read. Null outside the cloud, when nothing is counted, or
 * when nothing was ever read. Never throws.
 * @param {object} store
 * @param {string} organizationId
 * @returns {Promise<{ minutes: number, resetAt: string|null, syncedAt: number, cached: boolean }|null>}
 */
export async function loadTranscriptionCredit(store, organizationId) {
  if (getEnv("VUE_APP_MODE") !== "cloud" || !organizationId) return null
  const [usage, lots] = await Promise.all([
    store.dispatch("billing/fetchUsage", organizationId),
    store.dispatch("billing/fetchCreditLots", organizationId),
  ])
  if (!usage || !lots) {
    const remembered = readRememberedCredit(organizationId)
    return remembered ? { ...remembered, cached: true } : null
  }
  const credit = computeTranscriptionCredit({ usage, lots })
  const read = credit ? { ...credit, syncedAt: Date.now() } : null
  rememberCredit(organizationId, read)
  return read ? { ...read, cached: false } : null
}

function readRememberedCredit(organizationId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + organizationId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function rememberCredit(organizationId, credit) {
  try {
    if (credit) {
      localStorage.setItem(
        STORAGE_PREFIX + organizationId,
        JSON.stringify(credit),
      )
    } else {
      localStorage.removeItem(STORAGE_PREFIX + organizationId)
    }
  } catch (error) {
    console.error("cannot remember the transcription credit", error)
  }
}
