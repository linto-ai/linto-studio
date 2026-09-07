import { apiGetGenericFileFromConversation } from "@/api/conversation.js"

export async function onRegenerate(
  { core, store, state, conversationId, t },
  { id },
) {
  const entry = store.getters["llmServices/byId"](id)
  if (!entry) return

  core.llmServices.setStatus(id, "queued")
  core.llmServices.setProgress(id, 0, null)
  core.llmServices.setError(id, null)

  try {
    const req = await apiGetGenericFileFromConversation(
      conversationId,
      entry.route,
      entry.flavor,
      {
        preview: false,
        title: id,
        regenerate: true,
        llmOutputType: "markdown",
      },
    )
    if (state.destroyed) return
    if (req?.status === "error") {
      core.llmServices.setError(id, req?.message || t("publish.generic_error"))
    }
    // On success, the WS will drive subsequent setProgress / setStatus / setContent.
  } catch (e) {
    if (state.destroyed) return
    core.llmServices.setError(id, t("publish.generic_error"))
  }
}
