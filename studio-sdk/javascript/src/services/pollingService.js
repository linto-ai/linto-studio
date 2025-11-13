export class PollingService extends EventTarget {
  constructor(mediaId, apiService) {
    super()
    this.mediaId = mediaId
    this.apiService = apiService

    this.pollingInterval = setInterval(async () => {
      const media = await this.apiService.getMediaStatus({ mediaId })
      const job = media?.jobs?.transcription

      switch (job?.state) {
        case "done":
          clearInterval(this.pollingInterval)
          const media = await this.apiService.getMedia({ mediaId })
          this.dispatchEvent(new CustomEvent("done", { detail: media }))
          break
        case "error":
          clearInterval(this.pollingInterval)
          this.dispatchEvent(new Event("error"))
          break
        default:
          this.dispatchEvent(new CustomEvent("update", { detail: job }))
          break
      }
    }, 1000)
  }
}
