import { StudioApiService } from "./src/services/studioApiService.js"
import { PollingService } from "./src/services/pollingService.js"
class LinTO {
  constructor({ authToken, baseUrl = "https://studio.linto.ai/cm-api" } = {}) {
    this.baseUrl = baseUrl
    this.apiService = new StudioApiService({
      token: authToken,
      baseUrl,
    })
  }

  async transcribe(
    file,
    {
      enableDiarization = true,
      numberOfSpeaker = "0",
      language = "*",
      enablePunctuation = true,
      name = null,
    } = {}
  ) {
    // await this.apiService.login({
    //   email: "",
    //   password: "",
    // })

    const res = await this.apiService.uploadFile({
      file,
      enableDiarization,
      enablePunctuation: enablePunctuation,
      numberOfSpeaker,
      language,
      name,
    })
    const mediaId = res.conversationId
    return new PollingService(mediaId, this.apiService)
  }
}

try {
  window.LinTO = LinTO
} catch (error) {}

export default LinTO
