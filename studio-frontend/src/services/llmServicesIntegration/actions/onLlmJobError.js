import { resolveServiceId } from "../resolveServiceId.js"

export function onLlmJobError({ core, store, conversationId, t }, update) {
  if (update.conversationId && update.conversationId !== conversationId) {
    return
  }
  const id = resolveServiceId(store, update)
  if (!id) return
  core.llmServices.setError(id, update.error || t("publish.error_llm_server"))
}
