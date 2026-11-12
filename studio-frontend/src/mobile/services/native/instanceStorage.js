import { DEFAULT_INSTANCE } from "@/mobile/const/defaultInstance.js"
import { addRecentInstance } from "@/mobile/tools/addRecentInstance.js"

// The instance the native app talks to, kept on the phone. Imported before
// the API modules (applySavedInstance.js): it must not import the store or
// anything under src/api.
const CURRENT_KEY = "mobile_instance"
const RECENT_KEY = "mobile_recent_instances"

export function loadSavedInstance() {
  const saved = readJson(CURRENT_KEY)
  return isInstance(saved) ? saved : DEFAULT_INSTANCE
}

export function loadRecentInstances() {
  const saved = readJson(RECENT_KEY)
  return Array.isArray(saved) ? saved.filter(isInstance) : []
}

export function saveInstance(instance) {
  const recents = addRecentInstance(
    loadRecentInstances(),
    instance,
    DEFAULT_INSTANCE.address,
  )
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(instance))
    localStorage.setItem(RECENT_KEY, JSON.stringify(recents))
  } catch (error) {
    console.error("cannot save the instance", error)
  }
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function isInstance(value) {
  return typeof value?.address === "string" && typeof value?.base === "string"
}
