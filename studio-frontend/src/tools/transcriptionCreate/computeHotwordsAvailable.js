import { computeCompatibleServices } from "./computeCompatibleServices.js"

// For a file, when a dictionary exists and a compatible service applies them
export function computeHotwordsAvailable(draft, catalog) {
  if (draft.source !== "file") return false
  if (catalog.dictionaries.length === 0) return false
  return computeCompatibleServices(catalog.services, draft).some(
    (service) => service.hotwords === true,
  )
}
