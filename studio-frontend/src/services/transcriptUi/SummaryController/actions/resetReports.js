// Empties what the reports hold of a track, loading until the job list of
// the next one is known. They stay registered, so the editor keeps the
// report tab it is on when the followed track changes.
export function resetReports(core) {
  for (const { id } of core.llmServices.list.value) {
    core.llmServices.register({
      id,
      content: "",
      status: "loading",
      progress: 0,
      phase: null,
      error: null,
      lastUpdate: null,
      versions: [],
      activeVersionNumber: null,
      generations: [],
      currentGenerationId: null,
    })
    core.llmServices.setBusy(id, false)
    core.llmServices.setDirty(id, false)
  }
}
