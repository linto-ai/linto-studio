import { computeIsNeverGenerated } from "@/tools/llm/computeIsNeverGenerated.js"
import { onRegenerate } from "./onRegenerate.js"

// Opening a report that was never generated starts its generation right
// away: one click (the tab) instead of two (the tab, then "Generate").
export function generateIfNeverGenerated(context, id) {
  const { core, store, state } = context
  if (!id || state.destroyed) return
  const isNeverGenerated = computeIsNeverGenerated({
    jobsLoaded: state.jobsLoaded,
    entry: store.getters["llmServices/byId"](id),
    status: core.llmServices.get(id)?.status.value,
  })
  if (isNeverGenerated) onRegenerate(context, { id })
}
