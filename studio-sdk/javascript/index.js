import { StudioApiService } from "./src/services/studioApiService.js"
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

    this.apiService.uploadFile({ file })
  }
}

export default studioSDK
