import { apiGetExportVersion } from "@/api/service.js"

export async function onSelectVersion(
  { core, store, state, conversationId },
  { id, versionNumber },
) {
  const entry = store.getters["llmServices/byId"](id)
  if (!entry?.jobId) return

  core.llmServices.setBusy(id, true)
  try {
    const data = await apiGetExportVersion(
      conversationId,
      entry.jobId,
      versionNumber,
    )
    if (state.destroyed) return
    if (data && typeof data.content === "string") {
      core.llmServices.setContent(id, data.content, Date.now())
      core.llmServices.setActiveVersion(id, versionNumber)
    }
  } catch (e) {
    console.error("[llm] selectVersion failed for", id, e)
  } finally {
    if (!state.destroyed) core.llmServices.setBusy(id, false)
  }
}
