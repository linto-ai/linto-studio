/**
 * @jest-environment node
 *
 * Regression tests for diarization payload construction in the JS SDK.
 * Mirrors the Python SDK's test_upload_config.py::TestDiarizationPropagation
 * and TestDiarizationGracefulFallback for parity.
 */
import { jest } from "@jest/globals"
import { generateServiceConfig } from "../src/services/studioApiService.js"

const serviceWithDiarization = () => ({
  serviceName: "stt-fr",
  language: "*",
  scope: ["stt"],
  endpoints: [{ endpoint: "/stt-fr" }],
  model_type: "whisper",
  sub_services: {
    diarization: [{ service_name: "stt-diarization" }],
    punctuation: [],
  },
})

const serviceWithoutDiarization = () => ({
  serviceName: "stt-fr",
  language: "*",
  scope: ["stt"],
  endpoints: [{ endpoint: "/stt-fr" }],
  model_type: "whisper",
  sub_services: { diarization: [], punctuation: [] },
})

describe("generateServiceConfig — diarization payload", () => {
  test("enableDiarization=true with worker → enableDiarization stays true and serviceName is set", () => {
    const config = generateServiceConfig(serviceWithDiarization(), {
      enableDiarization: true,
    })
    expect(config.config.diarizationConfig.enableDiarization).toBe(true)
    expect(config.config.diarizationConfig.serviceName).toBe("stt-diarization")
  })

  test("enableDiarization defaults to false and serviceName is null", () => {
    const config = generateServiceConfig(serviceWithDiarization(), {})
    expect(config.config.diarizationConfig.enableDiarization).toBe(false)
    expect(config.config.diarizationConfig.serviceName).toBeNull()
    expect(config.config.diarizationConfig.numberOfSpeaker).toBeNull()
    expect(config.config.diarizationConfig.maxNumberOfSpeaker).toBeNull()
  })

  test("numberOfSpeaker propagated as int when diarization enabled", () => {
    const config = generateServiceConfig(serviceWithDiarization(), {
      enableDiarization: true,
      numberOfSpeaker: 3,
    })
    expect(config.config.diarizationConfig.numberOfSpeaker).toBe(3)
  })

  test("numberOfSpeaker accepts stringified values (env-style config)", () => {
    const config = generateServiceConfig(serviceWithDiarization(), {
      enableDiarization: true,
      numberOfSpeaker: "3",
    })
    expect(config.config.diarizationConfig.numberOfSpeaker).toBe(3)
  })

  test("numberOfSpeaker=0 (or '0') results in null", () => {
    const config = generateServiceConfig(serviceWithDiarization(), {
      enableDiarization: true,
      numberOfSpeaker: "0",
    })
    expect(config.config.diarizationConfig.numberOfSpeaker).toBeNull()
  })
})

describe("generateServiceConfig — graceful fallback", () => {
  test("requesting diarization without a worker falls back to disabled", () => {
    const config = generateServiceConfig(serviceWithoutDiarization(), {
      enableDiarization: true,
      numberOfSpeaker: 2,
    })
    const diar = config.config.diarizationConfig
    expect(diar.enableDiarization).toBe(false)
    expect(diar.serviceName).toBeNull()
    expect(diar.numberOfSpeaker).toBeNull()
    expect(diar.maxNumberOfSpeaker).toBeNull()
  })

  test("missing sub_services entirely is handled (no throw)", () => {
    const service = {
      serviceName: "stt-fr",
      language: "fr-FR",
      scope: ["stt"],
      endpoints: [{ endpoint: "/stt-fr" }],
      model_type: "whisper",
      // no sub_services
    }
    expect(() =>
      generateServiceConfig(service, { enableDiarization: true })
    ).not.toThrow()
    const config = generateServiceConfig(service, { enableDiarization: true })
    expect(config.config.diarizationConfig.enableDiarization).toBe(false)
  })

  test("requesting diarization with a worker keeps it on (sanity)", () => {
    const config = generateServiceConfig(serviceWithDiarization(), {
      enableDiarization: true,
    })
    expect(config.config.diarizationConfig.enableDiarization).toBe(true)
    expect(config.config.diarizationConfig.serviceName).toBe("stt-diarization")
  })
})

describe("transcribe — diarization end-to-end via fetch mock", () => {
  let LinTO
  let originalFetch

  beforeAll(async () => {
    LinTO = (await import("../index.js")).default
  })

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    jest.clearAllMocks()
  })

  function makeFetchMock(serviceList) {
    const captured = []
    const mock = jest.fn(async (req) => {
      const entry = {
        url: req.url,
        method: req.method,
        body: null,
        formFields: {},
      }
      if (req.body) {
        const ct = req.headers.get("content-type") || ""
        if (ct.includes("multipart/form-data")) {
          const fd = await req.clone().formData()
          for (const [k, v] of fd.entries()) {
            entry.formFields[k] = typeof v === "string" ? v : "<blob>"
          }
        } else {
          entry.body = await req.clone().text()
        }
      }
      captured.push(entry)

      const path = new URL(req.url).pathname
      if (path.endsWith("/api/services")) {
        return new Response(JSON.stringify(serviceList), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }
      if (path.endsWith("/api/organizations")) {
        return new Response(JSON.stringify([{ _id: "org-1" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }
      if (path.includes("/conversations/create")) {
        return new Response(JSON.stringify({ conversationId: "conv-1" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    })
    return { mock, captured }
  }

  test("enableDiarization=true is propagated end-to-end when worker is available", async () => {
    const { mock, captured } = makeFetchMock([serviceWithDiarization()])
    global.fetch = mock

    const linto = new LinTO({
      authToken: "tok-1",
      baseUrl: "http://example.test",
    })
    const poller = await linto.transcribe(new Blob([new Uint8Array([1])]), {
      language: "fr",
      enableDiarization: true,
    })
    poller.stop()

    const upload = captured.find((c) =>
      /\/conversations\/create/.test(c.url)
    )
    expect(upload).toBeDefined()
    const config = JSON.parse(upload.formFields.transcriptionConfig)
    expect(config.diarizationConfig.enableDiarization).toBe(true)
    expect(config.diarizationConfig.serviceName).toBe("stt-diarization")
  })

  test("enableDiarization=true with no worker available falls back gracefully", async () => {
    const { mock, captured } = makeFetchMock([serviceWithoutDiarization()])
    global.fetch = mock

    const linto = new LinTO({
      authToken: "tok-1",
      baseUrl: "http://example.test",
    })
    const poller = await linto.transcribe(new Blob([new Uint8Array([1])]), {
      language: "fr",
      enableDiarization: true,
    })
    poller.stop()

    const upload = captured.find((c) =>
      /\/conversations\/create/.test(c.url)
    )
    expect(upload).toBeDefined()
    const config = JSON.parse(upload.formFields.transcriptionConfig)
    expect(config.diarizationConfig.enableDiarization).toBe(false)
    expect(config.diarizationConfig.serviceName).toBeNull()
    expect(config.diarizationConfig.numberOfSpeaker).toBeNull()
  })

  test("snake_case enable_diarization (Python-style) is honored", async () => {
    const { mock, captured } = makeFetchMock([serviceWithDiarization()])
    global.fetch = mock

    const linto = new LinTO({
      authToken: "tok-1",
      baseUrl: "http://example.test",
    })
    // Use the lower-level apiService.uploadFile so we can pass snake_case
    // keys that mimic a Python-style caller. The decorator must accept both.
    await linto.apiService.uploadFile({
      file: new Blob([new Uint8Array([1])]),
      lang: "fr",
      enable_diarization: true,
      number_of_speaker: "2",
    })

    const upload = captured.find((c) =>
      /\/conversations\/create/.test(c.url)
    )
    expect(upload).toBeDefined()
    const config = JSON.parse(upload.formFields.transcriptionConfig)
    expect(config.diarizationConfig.enableDiarization).toBe(true)
    expect(config.diarizationConfig.numberOfSpeaker).toBe(2)
  })
})
