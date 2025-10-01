import {
  prepareRequest,
  prepareMultipartFormData,
  sendRequest,
} from "../request.js"

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
    return services?.filter((service) => service.scope.indexOf("asr") > -1)
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
    return conv
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
    formData.append("name", "name")
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
