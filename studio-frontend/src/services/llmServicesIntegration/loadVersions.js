import { apiListExportVersions } from "@/api/service.js"
import { mapVersions } from "@/tools/llm/mapVersion.js"

// Fetches the gateway version list for a service and pushes it into the
// SDK core (versions + activeVersion = latest). Internal helper, called from
// loadServices, onLlmJobComplete and onSaveVersion.

export async function loadVersions({
  core,
  store,
  state,
  conversationId,
  id,
}) {
  const entry = store.getters["llmServices/byId"](id)
  if (!entry?.jobId) return
  try {
    const versions = await apiListExportVersions(conversationId, entry.jobId)
    if (state.destroyed) return
    const mapped = mapVersions(versions)
    core.llmServices.setVersions(id, mapped)
    if (mapped.length > 0) {
      const latest = Math.max(...mapped.map((v) => v.versionNumber))
      core.llmServices.setActiveVersion(id, latest)
    } else {
      core.llmServices.setActiveVersion(id, null)
    }
  } catch (e) {
    console.error("[llm] loadVersions failed for", id, e)
  }
}
