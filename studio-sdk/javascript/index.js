import { StudioApiService } from "./src/services/studioApiService.js"
import { PollingService } from "./src/services/pollingService.js"
import { SummaryPollingService } from "./src/services/summaryPollingService.js"
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
      enablePunctuation = true,
      language = "*",
      quality = null,
      modelType = null,
      name = null,
      serviceName = null,
      endpointAsr = null,
      diarizationServiceName = null,
      punctuationServiceName = null,
    } = {}
  ) {
    const res = await this.apiService.uploadFile({
      file,
      enableDiarization,
      numberOfSpeaker,
      enablePunctuation: enablePunctuation,
      language,
      quality,
      modelType,
      name,
      serviceName,
      endpointAsr,
      diarizationServiceName,
      punctuationServiceName,
    })
    const mediaId = res.conversationId
    return new PollingService(mediaId, this.apiService)
  }

  async listServices() {
    const services = await this.apiService.fetchAsrServices()
    return services.map((service) => {
      const s = { ...service, service_name: service.serviceName }
      delete s.serviceName
      return s
    })
  }

  async listLlmServices() {
    return await this.apiService.fetchLlmServices()
  }

  async summarize(conversationId, serviceRoute, { flavor } = {}) {
    await this.apiService.triggerSummary({
      conversationId,
      format: serviceRoute,
      flavor,
    })
    return new SummaryPollingService(conversationId, serviceRoute, this.apiService)
  }
}

try {
  window.LinTO = LinTO
} catch (error) {}

export default LinTO
