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

  async uploadFile(args) {
    return await this.#withToken(
      this.#withOrganizationId(this.#withUploadConfig(this.#uploadFile))
    )(args)
  }

  // -- LLM / Summary methods --

  async fetchLlmServices(args) {
    return await this.#withToken(
      this.#withOrganizationId(this.#fetchLlmServices.bind(this))
    )(args)
  }

  async triggerSummary({ conversationId, format, flavor } = {}) {
    return await this.#withToken(this.#triggerSummary)({
      conversationId,
      format,
      flavor,
    })
  }

  async getExportList({ conversationId } = {}) {
    return await this.#withToken(this.#getExportList)({ conversationId })
  }

  async getExportContent({ conversationId, jobId } = {}) {
    return await this.#withToken(this.#getExportContent)({
      conversationId,
      jobId,
    })
  }

  // -- Download / Publication methods --

  async downloadConversation({ conversationId, format = "docx" } = {}) {
    return await this.#withToken(this.#downloadConversation)({
      conversationId,
      format,
    })
  }

  async getPublicationTemplates(args = {}) {
    return await this.#withToken(
      this.#withOrganizationId(this.#getPublicationTemplates.bind(this))
    )(args)
  }

  async getTemplatePlaceholders({ templateId } = {}) {
    return await this.#withToken(this.#getTemplatePlaceholders)({
      templateId,
    })
  }

  async exportWithTemplate({
    jobId,
    format = "pdf",
    templateId,
    versionNumber,
  } = {}) {
    return await this.#withToken(this.#exportWithTemplate)({
      jobId,
      format,
      templateId,
      versionNumber,
    })
  }

  // -- Taxonomy methods (categories, tags, folders) --

  async listCategories(args = {}) {
    return await this.#withToken(
      this.#withOrganizationId(this.#listCategories.bind(this))
    )(args)
  }

  async listTags({ categoryId } = {}) {
    return await this.#withToken(
      this.#withOrganizationId(this.#listTags.bind(this))
    )({ categoryId })
  }

  async createTag({ categoryId, name, color, emoji, description } = {}) {
    return await this.#withToken(
      this.#withOrganizationId(this.#createTag.bind(this))
    )({ categoryId, name, color, emoji, description })
  }

  async listFolders({ tree = false, withConversationCount = false } = {}) {
    return await this.#withToken(
      this.#withOrganizationId(this.#listFolders.bind(this))
    )({ tree, withConversationCount })
  }

  async createFolder({
    name,
    parentId,
    color,
    emoji,
    visibility = "public",
  } = {}) {
    return await this.#withToken(
      this.#withOrganizationId(this.#createFolder.bind(this))
    )({ name, parentId, color, emoji, visibility })
  }

  async moveConversationToFolder({ folderId, conversationId } = {}) {
    return await this.#withToken(
      this.#withOrganizationId(this.#moveConversationToFolder.bind(this))
    )({ folderId, conversationId })
  }

  async getConversation({ conversationId } = {}) {
    return await this.#withToken(this.#getConversation)({ conversationId })
  }

  async searchUsers({ search } = {}) {
    return await this.#withToken(this.#searchUsers)({ search })
  }

  async updateConversation({ conversationId, data } = {}) {
    return await this.#withToken(this.#updateConversation)({
      conversationId,
      data,
    })
  }

  async shareConversation({
    conversationId,
    email,
    right = 1,
    notify = true,
  } = {}) {
    return await this.#withToken(this.#shareConversation)({
      conversationId,
      email,
      right,
      notify,
    })
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

      return await method(args)
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

  // -- LLM / Summary private implementations --

  async #fetchLlmServices({ token, organizationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/services/${organizationId}/llm`,
      "GET",
      { token }
    )

    return await sendRequest(req)
  }

  async #triggerSummary({ token, conversationId, format, flavor }) {
    let url = `${this.baseApiUrl}/conversations/${conversationId}/download?format=${encodeURIComponent(format)}`
    if (flavor) {
      url += `&flavor=${encodeURIComponent(flavor)}`
    }
    const req = prepareRequest(url, "POST", { token })
    return await sendRequest(req)
  }

  async #getExportList({ token, conversationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/conversations/${conversationId}/export/list`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #getExportContent({ token, conversationId, jobId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/conversations/${conversationId}/export/${jobId}/content`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  // -- Download / Publication private implementations --

  async #downloadConversation({ token, conversationId, format }) {
    const url = `${this.baseApiUrl}/conversations/${conversationId}/download?format=${encodeURIComponent(format)}`
    const req = prepareRequest(url, "POST", { token })
    const isBinary =
      format === "docx" || format === "odt" || format === "verbatim"
    return await sendRequest(req, {
      responseType: isBinary ? "binary" : undefined,
    })
  }

  async #getPublicationTemplates({ token, organizationId }) {
    const url = `${this.baseApiUrl}/publication/templates?organization_id=${encodeURIComponent(organizationId)}`
    const req = prepareRequest(url, "GET", { token })
    return await sendRequest(req)
  }

  async #getTemplatePlaceholders({ token, templateId }) {
    const url = `${this.baseApiUrl}/publication/templates/${templateId}/placeholders`
    const req = prepareRequest(url, "GET", { token })
    return await sendRequest(req)
  }

  async #exportWithTemplate({
    token,
    jobId,
    format,
    templateId,
    versionNumber,
  }) {
    let url = `${this.baseApiUrl}/publication/${jobId}/export/${format}`
    const params = []
    if (templateId !== undefined && templateId !== null && templateId !== "") {
      params.push(`templateId=${encodeURIComponent(templateId)}`)
    }
    if (versionNumber !== undefined && versionNumber !== null) {
      params.push(`versionNumber=${encodeURIComponent(versionNumber)}`)
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`
    }
    const req = prepareRequest(url, "GET", { token })
    return await sendRequest(req, { responseType: "binary" })
  }

  // -- Taxonomy private implementations --

  async #listCategories({ token, organizationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/categories`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #listTags({ token, organizationId, categoryId }) {
    const url = `${this.baseApiUrl}/organizations/${organizationId}/tags?categoryId=${encodeURIComponent(categoryId)}`
    const req = prepareRequest(url, "GET", { token })
    return await sendRequest(req)
  }

  async #createTag({
    token,
    organizationId,
    categoryId,
    name,
    color,
    emoji,
    description,
  }) {
    const payload = {
      organizationId,
      categoryId,
      name,
    }
    if (color !== undefined && color !== null) payload.color = color
    if (emoji !== undefined && emoji !== null) payload.emoji = emoji
    if (description !== undefined && description !== null)
      payload.description = description

    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/tags`,
      "POST",
      { token, ...payload }
    )
    return await sendRequest(req)
  }

  async #listFolders({ token, organizationId, tree, withConversationCount }) {
    const params = []
    if (tree) params.push("tree=true")
    if (withConversationCount) params.push("withConversationCount=true")
    let url = `${this.baseApiUrl}/organizations/${organizationId}/folders`
    if (params.length > 0) {
      url += "?" + params.join("&")
    }
    const req = prepareRequest(url, "GET", { token })
    return await sendRequest(req)
  }

  async #createFolder({
    token,
    organizationId,
    name,
    parentId,
    color,
    emoji,
    visibility,
  }) {
    const payload = { name, visibility }
    if (parentId !== undefined && parentId !== null) payload.parentId = parentId
    if (color !== undefined && color !== null) payload.color = color
    if (emoji !== undefined && emoji !== null) payload.emoji = emoji

    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/folders`,
      "POST",
      { token, ...payload }
    )
    return await sendRequest(req)
  }

  async #moveConversationToFolder({
    token,
    organizationId,
    folderId,
    conversationId,
  }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/organizations/${organizationId}/folders/${folderId}/conversations/${conversationId}`,
      "POST",
      { token }
    )
    return await sendRequest(req)
  }

  async #getConversation({ token, conversationId }) {
    const req = prepareRequest(
      `${this.baseApiUrl}/conversations/${conversationId}`,
      "GET",
      { token }
    )
    return await sendRequest(req)
  }

  async #searchUsers({ token, search }) {
    const url = `${this.baseApiUrl}/users/search?search=${encodeURIComponent(search)}`
    const req = prepareRequest(url, "GET", { token })
    return await sendRequest(req)
  }

  async #updateConversation({ token, conversationId, data }) {
    const url = `${this.baseApiUrl}/conversations/${conversationId}`
    const requestObj = new Request(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
      body: JSON.stringify(data ?? {}),
    })
    return await sendRequest(requestObj)
  }

  async #shareConversation({ token, conversationId, email, right, notify }) {
    const url = `${this.baseApiUrl}/conversations/${conversationId}/invite`
    const payload = { email, right }
    if (notify === false) {
      payload.notify = false
    }
    const requestObj = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
      body: JSON.stringify(payload),
    })
    return await sendRequest(requestObj)
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
