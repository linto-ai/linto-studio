import {
  prepareRequest,
  prepareMultipartFormData,
  sendRequest,
} from "../request.js"

import mediaFactory from "../models/media.js"

export class StudioApiService {
  constructor({ baseUrl = "https://studio.linto.ai", token = null }) {
    this.baseApiUrl = baseUrl + "/api"
    this.baseAuthUrl = baseUrl + "/auth"
    this.token = token
    this.organizations = []
    this.asrServices = []
  }

  async fetchAsrServices(args) {
    const services = await this.#withToken(this.#fetchServices)(args)
    this.asrServices = services
    return services?.filter((service) => service.scope.indexOf("stt") > -1)
  }

  async getMediaStatus({ mediaId }) {
    const conv = await this.#withToken(this.#fetchMedia)({
      mediaId,
      key: "job",
    })
    return conv
  }

  async getMedia({ mediaId }) {
    const conv = await this.#withToken(this.#fetchMedia)({
      mediaId,
    })
    return mediaFactory(conv)
  }

  async fetchOrganizations(args) {
    const organizations = await this.#withToken(this.#fetchOrganizations)(args)
    this.organizations = organizations
    return organizations
  }

  async validateToken(args) {
    return await this.#withToken(this.#fetchSelf)(args)
  }

  async uploadFile(args) {
    return await this.#withToken(
      this.#withOrganizationId(this.#withUploadConfig(this.#uploadFile))
    )(args)
  }

  // -- Sessions --

  async listSessions(args) {
    return await this.#withToken(this.#withOrganizationId(this.#listSessions))(args)
  }

  async getSession(args) {
    return await this.#withToken(this.#withOrganizationId(this.#getSession))(args)
  }

  async createSession(args) {
    return await this.#withToken(this.#withOrganizationId(this.#createSession))(args)
  }

  async updateSession(args) {
    return await this.#withToken(this.#withOrganizationId(this.#updateSession))(args)
  }

  async stopSession(args) {
    return await this.#withToken(this.#withOrganizationId(this.#stopSession))(args)
  }

  async deleteSession(args) {
    return await this.#withToken(this.#withOrganizationId(this.#deleteSession))(args)
  }

  // -- Bots --

  async listBots(args) {
    return await this.#withToken(this.#withOrganizationId(this.#listBots))(args)
  }

  async createBot(args) {
    return await this.#withToken(this.#withOrganizationId(this.#createBot))(args)
  }

  async getBot(args) {
    return await this.#withToken(this.#withOrganizationId(this.#getBot))(args)
  }

  async deleteBot(args) {
    return await this.#withToken(this.#withOrganizationId(this.#deleteBot))(args)
  }

  // -- Transcriber Profiles --

  async listTranscriberProfiles(args) {
    return await this.#withToken(this.#withOrganizationId(this.#listTranscriberProfiles))(args)
  }

  // -- Templates --

  async listTemplates(args) {
    return await this.#withToken(this.#withOrganizationId(this.#listTemplates))(args)
  }

  async createTemplate(args) {
    return await this.#withToken(this.#withOrganizationId(this.#createTemplate))(args)
  }

  async getTemplate(args) {
    return await this.#withToken(this.#withOrganizationId(this.#getTemplate))(args)
  }

  async updateTemplate(args) {
    return await this.#withToken(this.#withOrganizationId(this.#updateTemplate))(args)
  }

  async deleteTemplate(args) {
    return await this.#withToken(this.#withOrganizationId(this.#deleteTemplate))(args)
  }

  // -- Quick Meetings --

  async listQuickMeetings(args) {
    return await this.#withToken(this.#withOrganizationId(this.#listQuickMeetings))(args)
  }

  async createQuickMeeting(args) {
    return await this.#withToken(this.#withOrganizationId(this.#createQuickMeeting))(args)
  }

  async deleteQuickMeeting(args) {
    return await this.#withToken(this.#withOrganizationId(this.#deleteQuickMeeting))(args)
  }

  // -- Conversations --

  async listConversations(args) {
    return await this.#withToken(this.#withOrganizationId(this.#listConversations))(args)
  }

  // -- Public Session (no auth) --

  async getPublicSession(args) {
    return await this.#getPublicSession(args)
  }

  async login({ email, password }) {
    const req = prepareRequest(`${this.baseAuthUrl}/login`, "POST", {
      email,
      password,
    })

    const res = await sendRequest(req)
    this.token = res.auth_token
    return res
  }

  // -- Decorators --

  #withOrganizationId(method) {
    return async (args = {}) => {
      if (!args?.organizationId) {
        if (this.organizations.length === 0) {
          await this.fetchOrganizations()
        }

        if (this.organizations.length === 0) {
          throw new Error("User has no organizations")
        }

        args.organizationId = this.organizations[0]._id
      }

      return await method.bind(this)(args)
    }
  }

  #withToken(method) {
    return async (args = {}) => {
      if (!args?.token) {
        if (!this.token) {
          throw new Error("No token. You need to pass a token or login first")
        }

        args.token = this.token
      }
      return await method.bind(this)(args)
    }
  }

  #withUploadConfig(method) {
    return async ({ file, lang = "*", ...args } = {}) => {
      if (this.asrServices.length == 0) {
        await this.fetchAsrServices()
      }

      const selectedService = getServiceByQualityAndLang(
        this.asrServices,
        1,
        lang
      )

      if (!selectedService) {
        throw new Error(`No ASR services available for lang=${lang}`)
      }

      const serviceConfig = generateServiceConfig(selectedService, {
        enablePunctuation: args["enablePunctuation"],
        enableDiarization: args["enableDiarization"],
        numberOfSpeaker: args["numberOfSpeaker"],
      })

      args["serviceName"] = args["serviceName"] ?? serviceConfig.serviceName
      args["endpoint"] = args["endpoint"] ?? serviceConfig.endpoint
      args["transcriptionConfig"] =
        args["transcriptionConfig"] ?? serviceConfig.config
      args["lang"] = lang
      args["file"] = file
      args["name"] = args["name"] ?? `imported file ${new Date().toISOString()}`
      args["segmentCharSize"] = args["segmentCharSize"] ?? 2000
      return await method.bind(this)(args)
    }
  }

  // -- API calls --
  async #fetchMedia({ token, mediaId, ...params }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/conversations/${mediaId}`,
      "GET",
      { token, ...params }
    )

    return await sendRequest(req)
  }

  async #fetchServices({ token }) {
    const req = prepareRequest(`${this.baseApiUrl}/services`, "GET", {
      token,
    })

    return await sendRequest(req)
  }

  async #fetchOrganizations({ token }) {
    const req = prepareRequest(`${this.baseApiUrl}/organizations`, "GET", {
      token,
    })

    return await sendRequest(req)
  }

  async #fetchSelf({ token }) {
    const req = prepareRequest(`${this.baseApiUrl}/users/self`, "GET", {
      token,
    })

    return await sendRequest(req)
  }

  async #uploadFile({
    token,
    organizationId,
    file,
    name,
    transcriptionConfig,
    serviceName,
    endpoint,
    lang,
    segmentCharSize,
  }) {
    if (!file) {
      throw new Error("File is required")
    }

    let formData = new FormData()
    formData.append("name", name)
    formData.append("file", file)
    formData.append("serviceName", serviceName)
    formData.append("transcriptionConfig", JSON.stringify(transcriptionConfig))
    formData.append("segmentCharSize", segmentCharSize)
    formData.append("lang", lang)
    formData.append("endpoint", endpoint)
    const req = prepareMultipartFormData(
      `${this.baseApiUrl}/organizations/${organizationId}/conversations/create`,
      token,
      formData
    )

    return await sendRequest(req)
  }

  // -- Sessions API calls --

  async #listSessions({ token, organizationId, ...params }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/sessions`,
      "GET",
      { token, ...params }
    )
    return await sendRequest(req)
  }

  async #getSession({ token, organizationId, sessionId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/sessions/${sessionId}`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #createSession({ token, organizationId, ...body }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/sessions/`,
      "POST",
      { token, ...body }
    )
    return await sendRequest(req)
  }

  async #updateSession({ token, organizationId, sessionId, ...body }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/sessions/${sessionId}`,
      "PUT",
      { token, ...body }
    )
    return await sendRequest(req)
  }

  async #stopSession({ token, organizationId, sessionId, force }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/sessions/${sessionId}/stop`,
      "PUT",
      { token, ...(force !== undefined ? { force } : {}) }
    )
    return await sendRequest(req)
  }

  async #deleteSession({ token, organizationId, sessionId, name }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/sessions/${sessionId}`,
      "DELETE",
      { token, ...(name !== undefined ? { name } : {}) }
    )
    return await sendRequest(req)
  }

  // -- Bots API calls --

  async #listBots({ token, organizationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/bots`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #createBot({ token, organizationId, url, channelId, provider, enableDisplaySub }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/bots`,
      "POST",
      { token, url, channelId, provider, enableDisplaySub }
    )
    return await sendRequest(req)
  }

  async #getBot({ token, organizationId, botId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/bots/${botId}`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #deleteBot({ token, organizationId, botId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/bots/${botId}`,
      "DELETE",
      { token }
    )
    return await sendRequest(req)
  }

  // -- Transcriber Profiles API calls --

  async #listTranscriberProfiles({ token, organizationId, quickMeeting }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/transcriber_profiles`,
      "GET",
      { token, ...(quickMeeting !== undefined ? { quickMeeting } : {}) }
    )
    return await sendRequest(req)
  }

  // -- Templates API calls --

  async #listTemplates({ token, organizationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/templates`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #createTemplate({ token, organizationId, ...body }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/templates`,
      "POST",
      { token, ...body }
    )
    return await sendRequest(req)
  }

  async #getTemplate({ token, organizationId, templateId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/templates/${templateId}`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #updateTemplate({ token, organizationId, templateId, ...body }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/templates/${templateId}`,
      "PUT",
      { token, ...body }
    )
    return await sendRequest(req)
  }

  async #deleteTemplate({ token, organizationId, templateId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/templates/${templateId}`,
      "DELETE",
      { token }
    )
    return await sendRequest(req)
  }

  // -- Quick Meetings API calls --

  async #listQuickMeetings({ token, organizationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/quickMeeting/`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #createQuickMeeting({ token, organizationId, ...body }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/quickMeeting/`,
      "POST",
      { token, ...body }
    )
    return await sendRequest(req)
  }

  async #deleteQuickMeeting({ token, organizationId, quickMeetingId, trash }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/quickMeeting/${quickMeetingId}`,
      "DELETE",
      { token, ...(trash !== undefined ? { trash } : {}) }
    )
    return await sendRequest(req)
  }

  // -- Conversations API calls --

  async #listConversations({ token, organizationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/conversations`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  // -- Public Session API call (no auth) --

  async #getPublicSession({ sessionId, password }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/sessions/${sessionId}/public`,
      "GET",
      { ...(password !== undefined ? { password } : {}) }
    )
    return await sendRequest(req)
  }
}

function getServiceByQualityAndLang(services, quality, lang) {
  return services.find((service) => {
    return service.language == "*" || service.language == lang
  })
}

function generateServiceConfig(
  service,
  {
    enablePunctuation = false,
    enableDiarization = false,
    numberOfSpeaker = 0,
    languageValue = service?.language || "*",
  } = {}
) {
  const isWhisper = service?.model_type === "whisper"
  const subServices = service?.sub_services

  const punctuationServiceList = subServices?.punctuation
  const punctuationService =
    enablePunctuation && !isWhisper && punctuationServiceList.length > 0
      ? punctuationServiceList[0].service_name
      : null

  const diarizationServiceList = subServices?.diarization
  const diarizationService =
    enableDiarization && diarizationServiceList.length > 0
      ? diarizationServiceList[0].service_name
      : null

  return {
    serviceName: service.serviceName,
    endpoint: removeLeadingSlash(service.endpoints[0].endpoint),
    lang: languageValue,
    config: {
      language: languageValue,
      punctuationConfig: {
        enablePunctuation: enablePunctuation && !isWhisper,
        serviceName: punctuationService,
      },
      diarizationConfig: {
        enableDiarization: enableDiarization,
        numberOfSpeaker:
          enableDiarization && numberOfSpeaker > 0
            ? parseInt(numberOfSpeaker)
            : null,
        maxNumberOfSpeaker: enableDiarization ? 100 : null,
        serviceName: diarizationService,
      },
      enableNormalization: true,
      modelType: service.model_type,
      vadConfig: isWhisper
        ? {
            enableVAD: true,
            methodName: "WebRTC",
            minDuration: 30,
          }
        : {
            enableVAD: true,
            methodName: "WebRTC",
            minDuration: 0,
          },
    },
  }
}

function removeLeadingSlash(str) {
  return str.replace(/^\/+/, "")
}
