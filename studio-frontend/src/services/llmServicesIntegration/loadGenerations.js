import { apiListGenerations } from "@/api/service.js"
import { mapGenerations } from "@/tools/llm/mapGeneration.js"

// Fetches the gateway generations for a service, pushes them into the SDK
// core (generations + currentGenerationId), and syncs the host store with
// the generationId → jobId mapping so subsequent fetches know which job
// to query.

export async function loadGenerations({
  core,
  store,
  state,
  conversationId,
  id,
}) {
  const entry = store.getters["llmServices/byId"](id)
  if (!entry) return

  const serviceId = entry.route || id
  let apiList = []
  try {
    apiList = await apiListGenerations(conversationId, serviceId)
  } catch (e) {
    console.error("[llm] apiListGenerations failed for", id, e)
    return
  }
  if (state.destroyed) return

  const mapping = {}
  let currentJobId = null
  let currentGenerationId = null
  for (const g of apiList) {
    if (g.generationId && g.jobId) mapping[g.generationId] = g.jobId
    if (g.isCurrent) {
      currentGenerationId = g.generationId ?? null
      currentJobId = g.jobId ?? null
    }
  }
  // Fallback: no isCurrent flagged → use the most recent (first in list).
  if (!currentGenerationId && apiList.length > 0) {
    const sorted = [...apiList].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    currentGenerationId = sorted[0].generationId ?? null
    currentJobId = sorted[0].jobId ?? null
  }

  store.commit("llmServices/SET_GENERATION_JOB_IDS", { id, mapping })
  if (currentJobId && currentJobId !== entry.jobId) {
    store.commit("llmServices/SET_JOB_ID", { id, jobId: currentJobId })
  }

  const mapped = mapGenerations(apiList)
  core.llmServices.setGenerations(id, mapped)
  core.llmServices.setCurrentGeneration(id, currentGenerationId)
}
