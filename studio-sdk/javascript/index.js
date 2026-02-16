import { StudioApiService } from "./src/services/studioApiService.js"
import { PollingService } from "./src/services/pollingService.js"
import { MeetingHandle } from "./src/services/meetingHandle.js"
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

  async validateToken() {
    return await this.apiService.validateToken()
  }

  async getOrganizations() {
    return await this.apiService.fetchOrganizations()
  }

  // -- Sessions --

  async listSessions(options = {}) {
    return await this.apiService.listSessions(options)
  }

  async getSession(sessionId, options = {}) {
    return await this.apiService.getSession({ sessionId, ...options })
  }

  async createSession({ channels, name, visibility, scheduleOn, endOn, autoStart, autoEnd, owner, meta, ...options } = {}) {
    return await this.apiService.createSession({ channels, name, visibility, scheduleOn, endOn, autoStart, autoEnd, owner, meta, ...options })
  }

  async updateSession(sessionId, updates, options = {}) {
    return await this.apiService.updateSession({ sessionId, ...updates, ...options })
  }

  async stopSession(sessionId, { force = false, ...options } = {}) {
    return await this.apiService.stopSession({ sessionId, force, ...options })
  }

  async deleteSession(sessionId, { name, ...options } = {}) {
    return await this.apiService.deleteSession({ sessionId, name, ...options })
  }

  // -- Bots --

  async listBots(options = {}) {
    return await this.apiService.listBots(options)
  }

  async createBot({ url, channelId, provider, enableDisplaySub = true, ...options } = {}) {
    return await this.apiService.createBot({ url, channelId, provider, enableDisplaySub, ...options })
  }

  async getBot(botId, options = {}) {
    return await this.apiService.getBot({ botId, ...options })
  }

  async deleteBot(botId, options = {}) {
    return await this.apiService.deleteBot({ botId, ...options })
  }

  // -- Transcriber Profiles --

  async listTranscriberProfiles({ quickMeeting, ...options } = {}) {
    return await this.apiService.listTranscriberProfiles({ quickMeeting, ...options })
  }

  // -- Templates --

  async listTemplates(options = {}) {
    return await this.apiService.listTemplates(options)
  }

  async createTemplate(data, options = {}) {
    return await this.apiService.createTemplate({ ...data, ...options })
  }

  async getTemplate(templateId, options = {}) {
    return await this.apiService.getTemplate({ templateId, ...options })
  }

  async updateTemplate(templateId, updates, options = {}) {
    return await this.apiService.updateTemplate({ templateId, ...updates, ...options })
  }

  async deleteTemplate(templateId, options = {}) {
    return await this.apiService.deleteTemplate({ templateId, ...options })
  }

  // -- Quick Meetings --

  async listQuickMeetings(options = {}) {
    return await this.apiService.listQuickMeetings(options)
  }

  async createQuickMeeting(data, options = {}) {
    return await this.apiService.createQuickMeeting({ ...data, ...options })
  }

  async deleteQuickMeeting(quickMeetingId, { trash, ...options } = {}) {
    return await this.apiService.deleteQuickMeeting({ quickMeetingId, trash, ...options })
  }

  // -- Conversations --

  async listConversations(options = {}) {
    return await this.apiService.listConversations(options)
  }

  // -- Public Session --

  async getPublicSession(sessionId, { password } = {}) {
    return await this.apiService.getPublicSession({ sessionId, password })
  }

  // -- Video Conference Transcription --

  async transcribeVideoConference({
    url,
    provider,
    transcriberProfileId,
    translations,
    diarization,
    keepAudio,
    name,
    visibility,
    meta,
    enableDisplaySub = true,
    ...options
  }) {
    if (!url) throw new Error("url is required")
    if (!provider) throw new Error("provider is required")
    if (!transcriberProfileId) throw new Error("transcriberProfileId is required")

    const channelConfig = {
      transcriberProfileId,
      enableLiveTranscripts: true,
      ...(diarization !== undefined ? { diarization } : {}),
      ...(keepAudio !== undefined ? { keepAudio } : {}),
      ...(translations ? { translations } : {}),
    }

    let session
    try {
      session = await this.createSession({
        channels: [channelConfig],
        ...(name ? { name } : {}),
        ...(visibility ? { visibility } : {}),
        ...(meta ? { meta } : {}),
        ...options,
      })

      const sessionId = session.id
      const channelId = session.channels?.[0]?.id

      if (!channelId) {
        throw new Error("Session created but no channelId returned")
      }

      const bot = await this.createBot({
        url,
        channelId,
        provider,
        enableDisplaySub,
        ...options,
      })

      return new MeetingHandle(sessionId, channelId, bot, this)
    } catch (err) {
      if (session?.id) {
        try { await this.stopSession(session.id, { force: true }) } catch {}
      }
      throw err
    }
  }
}

try {
  window.LinTO = LinTO
} catch (error) {}

export default LinTO
