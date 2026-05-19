/**
 * Polls an LLM summary export until it finishes.
 *
 * Emits `update`, `done` (with `{ content, jobId }`), `error`, and `cancelled`.
 * Call `.stop()` to clear the underlying interval.
 */
export class SummaryPollingService extends EventTarget {
  #intervalId = null

  constructor(
    conversationId,
    serviceRoute,
    apiService,
    { intervalMs = 2000 } = {}
  ) {
    super()
    this.conversationId = conversationId
    this.serviceRoute = serviceRoute
    this.apiService = apiService

    this.#intervalId = setInterval(async () => {
      try {
        const exports = await this.apiService.getExportList({
          conversationId,
        })

        const list = Array.isArray(exports) ? exports : []
        const exportEntry = list.find((e) => e?.format === serviceRoute)

        if (!exportEntry) {
          // No matching export yet; wait for next tick.
          return
        }

        const status = exportEntry.status

        if (status === "complete" || status === "done") {
          const jobId = exportEntry.jobId ?? null
          let content
          if (jobId) {
            content = await this.apiService.getExportContent({
              conversationId,
              jobId,
            })
          } else {
            content = exportEntry
          }
          this.#clearInterval()
          this.dispatchEvent(
            new CustomEvent("done", { detail: { content, jobId } })
          )
        } else if (status === "error") {
          this.#clearInterval()
          this.dispatchEvent(new CustomEvent("error", { detail: exportEntry }))
        } else {
          this.dispatchEvent(new CustomEvent("update", { detail: exportEntry }))
        }
      } catch (err) {
        this.#clearInterval()
        this.dispatchEvent(new CustomEvent("error", { detail: err }))
      }
    }, intervalMs)
  }

  stop() {
    if (this.#intervalId === null) {
      return
    }
    this.#clearInterval()
    this.dispatchEvent(new CustomEvent("cancelled"))
  }

  #clearInterval() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId)
      this.#intervalId = null
    }
  }
}
