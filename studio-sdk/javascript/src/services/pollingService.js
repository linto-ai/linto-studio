export class PollingService extends EventTarget {
  #intervalId = null

  constructor(mediaId, apiService, { intervalMs = 1000 } = {}) {
    super()
    this.mediaId = mediaId
    this.apiService = apiService

    this.#intervalId = setInterval(async () => {
      try {
        const media = await this.apiService.getMediaStatus({ mediaId })
        const job = media?.jobs?.transcription

        switch (job?.state) {
          case "done": {
            const fullMedia = await this.apiService.getMedia({ mediaId })
            this.#clearInterval()
            this.dispatchEvent(new CustomEvent("done", { detail: fullMedia }))
            break
          }
          case "error": {
            this.#clearInterval()
            this.dispatchEvent(new CustomEvent("error", { detail: job }))
            break
          }
          default:
            this.dispatchEvent(new CustomEvent("update", { detail: job }))
            break
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
