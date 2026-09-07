import { apiGetExportContent } from "@/api/service.js"
import { loadVersions } from "../loadVersions.js"

export async function onSelectGeneration(
  { core, store, state, conversationId, t },
  { id, generationId },
) {
  const entry = store.getters["llmServices/byId"](id)
  if (!entry) return

  const jobId = store.getters["llmServices/jobIdForGeneration"](
    id,
    generationId,
  )
  if (!jobId) {
    console.warn("[llm] selectGeneration: no jobId mapped for", generationId)
    return
  }

  core.llmServices.setBusy(id, true)
  try {
    // Point the host's current jobId at this generation so subsequent
    // version/save calls hit the right job.
    store.commit("llmServices/SET_JOB_ID", { id, jobId })
    core.llmServices.setCurrentGeneration(id, generationId)

    const r = await apiGetExportContent(conversationId, jobId)
    if (state.destroyed) return
    if (r?.status === "success" && typeof r.content === "string") {
      core.llmServices.setContent(id, r.content, Date.now())
    } else {
      core.llmServices.setError(id, t("publish.llm_gateway_unavailable"))
    }

    await loadVersions({ core, store, state, conversationId, id })
  } catch (e) {
    console.error("[llm] selectGeneration failed for", id, e)
    if (!state.destroyed) {
      core.llmServices.setError(id, t("publish.llm_gateway_unavailable"))
    }
  } finally {
    if (!state.destroyed) core.llmServices.setBusy(id, false)
  }
}
