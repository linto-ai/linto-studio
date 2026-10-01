// Empties what the services hold of a conversation. They stay registered, so
// the editor keeps the tab it is on when the conversation changes.
export function resetServices(core) {
  for (const { id } of core.llmServices?.list.value ?? []) {
    core.llmServices.register({
      id,
      content: "",
      status: "idle",
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
