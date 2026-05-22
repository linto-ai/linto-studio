import { apiGetExportContent } from "@/api/service.js"
import { resolveServiceId } from "../resolveServiceId.js"
import { loadVersions } from "../loadVersions.js"

export async function onLlmJobComplete(
  { core, store, state, conversationId, t },
  update,
) {
  if (update.conversationId && update.conversationId !== conversationId) {
    return
  }
  const id = resolveServiceId(store, update)
  if (!id) return

  core.llmServices.setStatus(id, "complete")

  try {
    const r = await apiGetExportContent(conversationId, update.jobId)
    if (state.destroyed) return
    if (r?.status === "success" && typeof r.content === "string") {
      core.llmServices.setContent(id, r.content, Date.now())
      await loadVersions({ core, store, state, conversationId, id })
    } else {
      core.llmServices.setError(id, t("publish.llm_gateway_unavailable"))
    }
  } catch (e) {
    if (state.destroyed) return
    core.llmServices.setError(id, t("publish.llm_gateway_unavailable"))
  }
}
