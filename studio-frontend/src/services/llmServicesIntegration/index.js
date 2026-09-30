// Glue between the SDK core and the host app for LLM services:
// - initial load (catalog + already-completed jobs)
// - WS dispatch (update / complete / error)
// - core event dispatch (regenerate / export / verbatim:export)
// - auto-generation of a never-generated report when it is opened
//
// All work lives in actions/. This file only wires deps together.

import { createLLMServicesPlugin } from "@linto-ai/transcript-ui-webcomponent"
import store from "@/store"

import { loadServices } from "./actions/loadServices.js"
import { onLlmJobUpdate } from "./actions/onLlmJobUpdate.js"
import { onLlmJobComplete } from "./actions/onLlmJobComplete.js"
import { onLlmJobError } from "./actions/onLlmJobError.js"
import { onRegenerate } from "./actions/onRegenerate.js"
import { generateIfNeverGenerated } from "./actions/generateIfNeverGenerated.js"
import { onExport } from "./actions/onExport.js"
import { onSelectVersion } from "./actions/onSelectVersion.js"
import { onSaveVersion } from "./actions/onSaveVersion.js"
import { onSelectGeneration } from "./actions/onSelectGeneration.js"
import { onVerbatimExport } from "./actions/onVerbatimExport.js"
import { resetServices } from "./actions/resetServices.js"

export function setupLLMServices(
  core,
  {
    conversationId,
    organizationId,
    securityLevel,
    conversationName,
    apiEventWS,
    locale,
    t,
    notify,
    openPublication,
  },
) {
  // jobsLoaded: the conversation's job list is known (see loadServices).
  const state = { destroyed: false, jobsLoaded: false }

  store.commit("llmServices/RESET")
  // Once per editor: the rest is set up again for each conversation.
  if (!core.llmServices) core.use(createLLMServicesPlugin())

  const unsubRegenerate = core.on("llmService:regenerate", (p) =>
    onRegenerate({ core, store, state, conversationId, t }, p),
  )
  const unsubActive = core.on("llmService:active", ({ id }) =>
    generateIfNeverGenerated({ core, store, state, conversationId, t }, id),
  )
  const unsubExport = core.on("llmService:export", (p) =>
    onExport({ store, conversationId, t, notify, openPublication }, p),
  )
  const unsubSelectVersion = core.on("llmService:selectVersion", (p) =>
    onSelectVersion({ core, store, state, conversationId }, p),
  )
  const unsubSaveVersion = core.on("llmService:saveVersion", (p) =>
    onSaveVersion({ core, store, state, conversationId, t, notify }, p),
  )
  const unsubSelectGeneration = core.on("llmService:selectGeneration", (p) =>
    onSelectGeneration({ core, store, state, conversationId, t }, p),
  )
  const unsubVerbatim = core.on("verbatim:export", (p) =>
    onVerbatimExport({ conversationId, conversationName, t, notify }, p),
  )

  const socket = apiEventWS?.socket
  const handleUpdate = (u) => onLlmJobUpdate({ core, store, conversationId }, u)
  const handleComplete = (u) =>
    onLlmJobComplete({ core, store, state, conversationId, t }, u)
  const handleError = (u) =>
    onLlmJobError({ core, store, conversationId, t }, u)

  if (socket) {
    socket.on("llm:job:update", handleUpdate)
    socket.on("llm:job:complete", handleComplete)
    socket.on("llm:job:error", handleError)
    socket.emit("llm:join", { organizationId, conversationId })
  }

  loadServices({
    core,
    store,
    state,
    conversationId,
    organizationId,
    securityLevel,
    locale,
  }).then((jobsLoaded) => {
    state.jobsLoaded = jobsLoaded
    // The report may already be open: tab opened during the load, or channel
    // switched while on the tab.
    generateIfNeverGenerated(
      { core, store, state, conversationId, t },
      core.llmServices.activeId.value,
    )
  })

  return {
    dispose() {
      state.destroyed = true

      if (socket) {
        try {
          socket.emit("llm:leave", { organizationId, conversationId })
        } catch (_) {
          // socket may already be closed
        }
        socket.off("llm:job:update", handleUpdate)
        socket.off("llm:job:complete", handleComplete)
        socket.off("llm:job:error", handleError)
      }

      unsubRegenerate?.()
      unsubActive?.()
      unsubExport?.()
      unsubSelectVersion?.()
      unsubSaveVersion?.()
      unsubSelectGeneration?.()
      unsubVerbatim?.()

      resetServices(core)
      store.commit("llmServices/RESET")
    },
  }
}
