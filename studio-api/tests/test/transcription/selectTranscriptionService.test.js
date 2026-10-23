const {
  filterTranscriptionServices,
  selectTranscriptionService,
  serviceLanguage,
} = require(`${process.cwd()}/lib/transcription/selectTranscriptionService`)

// Parakeet only detects the language; Canary speaks the European languages
// and is listed first; Whisper speaks nearly all of them.
const parakeet = {
  serviceName: "parakeet",
  model_type: "nemo",
  language: "*",
  order: 3,
  sub_services: { diarization: [{ service_name: "pyannote" }] },
}
const canary = {
  serviceName: "canary",
  model_type: "nemo",
  language: "fr-FR,en-US,de-DE",
  order: 1,
  sub_services: {
    diarization: [
      { service_name: "pyannote", info: { speaker_identification: true } },
    ],
  },
}
const whisper = {
  serviceName: "whisper",
  model_type: "whisper",
  language: "*,fr-FR,en-US,de-DE,ja-JP",
  order: 2,
  sub_services: { diarization: [{ service_name: "pyannote" }] },
}
const services = [whisper, canary, parakeet]

function names(list) {
  return list.map((service) => service.serviceName)
}

function pick(request, list = services) {
  const candidates = filterTranscriptionServices(list, request)
  return selectTranscriptionService(candidates, request, 1800)
}

describe("filterTranscriptionServices", () => {
  it("keeps the services speaking the language", () => {
    expect(
      names(filterTranscriptionServices(services, { language: "fr-FR" })),
    ).toEqual(["whisper", "canary"])
    expect(
      names(filterTranscriptionServices(services, { language: "fr" })),
    ).toEqual(["whisper", "canary"])
    expect(
      names(filterTranscriptionServices(services, { language: "*" })),
    ).toEqual(["whisper", "parakeet"])
  })

  it("keeps every service when nobody speaks the language", () => {
    expect(
      names(filterTranscriptionServices(services, { language: "xx-XX" })),
    ).toEqual(["whisper", "canary", "parakeet"])
  })

  it("narrows to the requested features when someone offers them", () => {
    const whisperWithoutDiarization = { ...whisper, sub_services: {} }
    expect(
      names(
        filterTranscriptionServices([whisperWithoutDiarization, parakeet], {
          language: "*",
          diarization: true,
        }),
      ),
    ).toEqual(["parakeet"])
    expect(
      names(
        filterTranscriptionServices([whisperWithoutDiarization], {
          language: "*",
          diarization: true,
        }),
      ),
    ).toEqual(["whisper"])
    expect(
      names(
        filterTranscriptionServices(services, {
          language: "fr-FR",
          speakerIdentification: true,
        }),
      ),
    ).toEqual(["canary"])
  })

  it("reads a serialized sub-service info", () => {
    const canaryWithStringInfo = {
      ...canary,
      sub_services: {
        diarization: [{ info: '{"speaker_identification": true}' }],
      },
    }
    expect(
      names(
        filterTranscriptionServices([whisper, canaryWithStringInfo], {
          language: "fr-FR",
          speakerIdentification: true,
        }),
      ),
    ).toEqual(["canary"])
  })

  it("returns nothing without services", () => {
    expect(filterTranscriptionServices([], { language: "*" })).toEqual([])
  })
})

describe("serviceLanguage", () => {
  it("finds the code the service lists, regardless of case or region", () => {
    expect(serviceLanguage(whisper, "fr-FR")).toBe("fr-FR")
    expect(serviceLanguage(whisper, "fr-fr")).toBe("fr-FR")
    expect(serviceLanguage(whisper, "fr")).toBe("fr-FR")
    expect(serviceLanguage(whisper, "*")).toBe("*")
    expect(serviceLanguage({ language: "fr-FR, en-US" }, "en")).toBe("en-US")
  })

  it("is null for a language the service does not list", () => {
    expect(serviceLanguage(canary, "ja-JP")).toBeNull()
    expect(serviceLanguage(canary, "*")).toBeNull()
    expect(serviceLanguage(canary, "")).toBeNull()
    expect(serviceLanguage(canary, "fr-CA")).toBeNull()
  })
})

describe("selectTranscriptionService", () => {
  it("sends a forced European language to Canary", () => {
    expect(pick({ language: "fr-FR", duration: 600 }).serviceName).toBe(
      "canary",
    )
    expect(pick({ language: "de-DE", duration: 7200 }).serviceName).toBe(
      "canary",
    )
  })

  it("sends a forced language outside Europe to Whisper", () => {
    expect(pick({ language: "ja-JP", duration: 7200 }).serviceName).toBe(
      "whisper",
    )
  })

  it("sends automatic detection to Whisper for a short file and Parakeet for a long one", () => {
    expect(pick({ language: "*", duration: 600 }).serviceName).toBe("whisper")
    expect(pick({ language: "*", duration: 1800 }).serviceName).toBe("parakeet")
  })

  it("falls back to the order when the duration of an automatic upload is unknown", () => {
    expect(pick({ language: "*" }).serviceName).toBe("whisper")
  })

  it("ignores a model type nobody has", () => {
    expect(
      pick({ language: "*", duration: 7200 }, [whisper, canary]).serviceName,
    ).toBe("whisper")
  })

  it("reads the long file threshold from its argument, the environment or a default", () => {
    const candidates = [whisper, parakeet]
    expect(
      selectTranscriptionService(
        candidates,
        { language: "*", duration: 600 },
        300,
      ).serviceName,
    ).toBe("parakeet")
    expect(
      selectTranscriptionService(candidates, { language: "*", duration: 600 })
        .serviceName,
    ).toBe("whisper")
    process.env.TRANSCRIPTION_LONG_FILE_SECONDS = "300"
    try {
      expect(
        selectTranscriptionService(candidates, { language: "*", duration: 600 })
          .serviceName,
      ).toBe("parakeet")
    } finally {
      delete process.env.TRANSCRIPTION_LONG_FILE_SECONDS
    }
  })

  it("returns null without candidates", () => {
    expect(selectTranscriptionService([], { language: "*" })).toBeNull()
  })
})
