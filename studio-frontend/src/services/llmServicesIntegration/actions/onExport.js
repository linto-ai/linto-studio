export function onExport({ store, t, notify, openPublication }, { id }) {
  const entry = store.getters["llmServices/byId"](id)
  if (!entry?.jobId) {
    notify("error", t("publish.export_error"))
    return
  }
  if (typeof openPublication !== "function") {
    console.warn(
      "[llm] openPublication callback missing — host did not wire the modal",
    )
    return
  }
  openPublication({ serviceId: id, jobId: entry.jobId })
}
