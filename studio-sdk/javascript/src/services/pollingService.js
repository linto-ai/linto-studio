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
          this.dispatchEvent(new Event("done"))
          break
        case "error":
          clearInterval(this.pollingInterval)
          this.dispatchEvent(new Event("error"))
        default:
          this.dispatchEvent(new Event("update", job))
          break
      }
    }, 1000)
  }
}
