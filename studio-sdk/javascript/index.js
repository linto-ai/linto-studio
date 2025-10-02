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
      enablePunctuation,
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
    })
    const mediaId = res.conversationId
    return new PollingService(mediaId, this.apiService)
  }
}

export default LinTO
