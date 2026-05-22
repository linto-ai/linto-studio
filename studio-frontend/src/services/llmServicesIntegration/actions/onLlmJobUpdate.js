import { mapStatus } from "@/tools/llm/mapStatus.js"
import { resolveServiceId } from "../resolveServiceId.js"

export function onLlmJobUpdate({ core, store, conversationId }, update) {
  if (update.conversationId && update.conversationId !== conversationId) {
    return
  }
  const id = resolveServiceId(store, update)
  if (!id) return

  const status = mapStatus(update.status)
  if (status) core.llmServices.setStatus(id, status)
  core.llmServices.setProgress(
    id,
    Number(update.progress?.percentage) || 0,
    update.progress?.phase ?? null,
  )
}
