import { apiUpdateExportResult } from "@/api/service.js"
import { loadVersions } from "../loadVersions.js"

export async function onSaveVersion(
  { core, store, state, conversationId, t, notify },
  { id, content },
) {
  const entry = store.getters["llmServices/byId"](id)
  if (!entry?.jobId) return

  core.llmServices.setBusy(id, true)
  try {
    const result = await apiUpdateExportResult(
      conversationId,
      entry.jobId,
      content,
    )
    if (state.destroyed) return
    if (result) {
      await loadVersions({ core, store, state, conversationId, id })
      if (state.destroyed) return
      // Canonicalise content from the saved draft → resets `dirty` via
      // the LLMServicePanel watcher on the SDK side.
      core.llmServices.setContent(id, content, Date.now())
      notify("success", t("publish.editor.version_saved"))
    } else {
      notify("error", t("publish.editor.version_save_error"))
    }
  } catch (e) {
    console.error("[llm] saveVersion failed for", id, e)
    if (!state.destroyed) notify("error", t("publish.editor.version_save_error"))
  } finally {
    if (!state.destroyed) core.llmServices.setBusy(id, false)
  }
}
