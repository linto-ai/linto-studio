import { StudioApiService } from "./src/services/studioApiService.js"
import { PollingService } from "./src/services/pollingService.js"
class studioSDK {
  constructor({
    token,
    baseUrl = "https://studio.linto.ai",
    apiPath = "cm-api",
    authPath = "auth",
  } = {}) {
    this.baseUrl = baseUrl
    this.apiPath = apiPath
    this.authPath = authPath
    this.apiService = new StudioApiService({
      token,
      baseUrl,
      apiPath,
      authPath,
    })
  }

  async transcribe(
    file,
    {
      quality = "best",
      speakerDiarization = true,
      numberOfSpeakers = "0",
      language = "*",
    } = {}
  ) {
    // await this.apiService.login({
    //   email: "",
    //   password: "",
    // })

    const res = await this.apiService.uploadFile({ file })
    const mediaId = res.conversationId
    return new PollingService(mediaId, this.apiService)
  }
}

export default studioSDK
