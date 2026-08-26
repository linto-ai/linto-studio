# @linto/transcript-ui-plugin-llm-services

Generated documents derived from the transcript — summaries, reports, key points — with versioning, regeneration, and progress/status tracking. No network calls: the host generates content and pushes it in; this plugin only holds and exposes the state.

## Usage

```ts
import { createLLMServicesPlugin } from "@linto/transcript-ui-plugin-llm-services"

core.use(createLLMServicesPlugin())

core.llmServices!.register({
  id: "summary",
  label: "Summary",
  status: "queued",
})
```

React to the UI's intents and push the result back in as it arrives:

```ts
core.on("llmService:regenerate", async ({ id }) => {
  core.llmServices!.setStatus(id, "processing")
  const content = await api.generateSummary(id, { onProgress: (p) => core.llmServices!.setProgress(id, p) })
  core.llmServices!.setContent(id, content, Date.now())
  core.llmServices!.setStatus(id, "complete")
})

core.on("llmService:export", ({ id }) => api.exportDocument(id))
core.on("llmService:saveVersion", ({ id, content }) => api.saveVersion(id, content))
```
