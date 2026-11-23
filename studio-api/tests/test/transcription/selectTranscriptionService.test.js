const {
  filterTranscriptionServices,
  selectTranscriptionService,
  selectGenericTranscriptionService,
  serviceLanguage,
} = require(`${process.cwd()}/lib/transcription/selectTranscriptionService`)

const cohere = {
  serviceName: "cohere",
  model_type: "cohere",
  language: "fr,en,de,es,it,pt,nl",
  sub_services: { diarization: [{ service_name: "pyannote" }] },
}
const qwen = {
  serviceName: "qwen",
  model_type: "qwen",
  language: "fr,en,de,es,it,pt,nl",
  sub_services: {
    diarization: [
      { service_name: "pyannote", info: { speaker_identification: true } },
    ],
  },
}
const whisper = {
  serviceName: "whisper",
  model_type: "whisper",
  language: "*,fr,en,de,es,it,pt,nl,pl,ja",
  sub_services: { diarization: [{ service_name: "pyannote" }] },
}
const services = [whisper, cohere, qwen]

function names(list) {
  return list.map((service) => service.serviceName)
}

function pick(request, list = services) {
  return selectTranscriptionService(list, request)
}

describe("filterTranscriptionServices", () => {
  it("keeps the services listing the language", () => {
    expect(
      names(filterTranscriptionServices(services, { language: "fr" })),
    ).toEqual(["whisper", "cohere", "qwen"])
    expect(
      names(filterTranscriptionServices(services, { language: "fr-FR" })),
    ).toEqual(["whisper", "cohere", "qwen"])
    expect(
      names(filterTranscriptionServices(services, { language: "pl" })),
    ).toEqual(["whisper"])
    expect(
      names(filterTranscriptionServices(services, { language: "*" })),
    ).toEqual(["whisper"])
  })

  it("keeps the services detecting the language, after the ones listing it", () => {
    const detecting = { ...whisper, serviceName: "detecting", language: "*" }
    expect(
      names(filterTranscriptionServices(services, { language: "sw" })),
    ).toEqual(["whisper"])
    expect(
      names(
        filterTranscriptionServices([detecting, cohere], { language: "fr" }),
      ),
    ).toEqual(["cohere", "detecting"])
  })

  it("keeps every service when nobody lists nor detects the language", () => {
    expect(
      names(filterTranscriptionServices([cohere, qwen], { language: "sw" })),
    ).toEqual(["cohere", "qwen"])
  })

  it("narrows to the requested features when someone offers them", () => {
    const cohereWithoutDiarization = { ...cohere, sub_services: {} }
    expect(
      names(
        filterTranscriptionServices([cohereWithoutDiarization, qwen], {
          language: "fr",
          diarization: true,
        }),
      ),
    ).toEqual(["qwen"])
    expect(
      names(
        filterTranscriptionServices([cohereWithoutDiarization], {
          language: "fr",
          diarization: true,
        }),
      ),
    ).toEqual(["cohere"])
    expect(
      names(
        filterTranscriptionServices(services, {
          language: "fr",
          speakerIdentification: true,
        }),
      ),
    ).toEqual(["qwen"])
  })

  it("reads a serialized sub-service info", () => {
    const qwenWithStringInfo = {
      ...qwen,
      sub_services: {
        diarization: [{ info: '{"speaker_identification": true}' }],
      },
    }
    expect(
      names(
        filterTranscriptionServices([cohere, qwenWithStringInfo], {
          language: "fr",
          speakerIdentification: true,
        }),
      ),
    ).toEqual(["qwen"])
  })

  it("returns nothing without services", () => {
    expect(filterTranscriptionServices([], { language: "*" })).toEqual([])
  })
})

describe("serviceLanguage", () => {
  it("gives the code the service lists, regardless of case or region", () => {
    const regional = { language: "*,fr-FR, en-US" }
    expect(serviceLanguage(regional, "fr-FR")).toBe("fr-FR")
    expect(serviceLanguage(regional, "fr-fr")).toBe("fr-FR")
    expect(serviceLanguage(regional, "fr")).toBe("fr-FR")
    expect(serviceLanguage(regional, "en")).toBe("en-US")
    expect(serviceLanguage(regional, "*")).toBe("*")
    expect(serviceLanguage(cohere, "fr-FR")).toBe("fr")
  })

  it("gives detection for a language the service only detects", () => {
    expect(serviceLanguage(whisper, "sw")).toBe("*")
    expect(serviceLanguage({}, "fr")).toBe("*")
  })

  it("keeps the language as given when the service neither lists nor detects it", () => {
    expect(serviceLanguage(cohere, "sw")).toBe("sw")
  })
})

describe("selectTranscriptionService", () => {
  it("sends a language of the rules to their first model", () => {
    expect(pick({ language: "fr" }).serviceName).toBe("cohere")
    expect(pick({ language: "de" }).serviceName).toBe("cohere")
    expect(pick({ language: "fr-FR" }).serviceName).toBe("cohere")
  })

  it("goes down the models of the rule when the first one is not running", () => {
    expect(pick({ language: "fr" }, [whisper, qwen]).serviceName).toBe("qwen")
    expect(pick({ language: "fr" }, [whisper]).serviceName).toBe("whisper")
  })

  it("falls back on whisper before qwen in Portuguese and Dutch", () => {
    expect(pick({ language: "pt" }).serviceName).toBe("cohere")
    expect(pick({ language: "pt" }, [qwen, whisper]).serviceName).toBe(
      "whisper",
    )
    expect(pick({ language: "nl" }, [qwen, whisper]).serviceName).toBe(
      "whisper",
    )
    expect(pick({ language: "nl" }, [qwen]).serviceName).toBe("qwen")
  })

  it("sends another or an unknown language to the default model", () => {
    expect(pick({ language: "pl" }).serviceName).toBe("whisper")
    expect(pick({ language: "sw" }).serviceName).toBe("whisper")
    expect(pick({ language: "*" }).serviceName).toBe("whisper")
  })

  it("goes down the default models: qwen, then cohere", () => {
    const listingPolish = (service) => ({ ...service, language: "pl" })
    expect(
      pick({ language: "pl" }, [listingPolish(cohere), listingPolish(qwen)])
        .serviceName,
    ).toBe("qwen")
    expect(pick({ language: "pl" }, [listingPolish(cohere)]).serviceName).toBe(
      "cohere",
    )
  })

  it("sends a request with hotwords to qwen, then whisper, cohere last", () => {
    const withHotwords = { language: "fr", hotwords: true }
    expect(pick(withHotwords).serviceName).toBe("qwen")
    expect(pick(withHotwords, [cohere, whisper]).serviceName).toBe("whisper")
    expect(pick(withHotwords, [cohere]).serviceName).toBe("cohere")
    expect(pick({ language: "nl", hotwords: true }).serviceName).toBe("qwen")
    expect(pick({ language: "pl", hotwords: true }).serviceName).toBe("whisper")
    expect(pick({ language: "fr", hotwords: false }).serviceName).toBe("cohere")
  })

  it("keeps to the services applying hotwords when one can take the request", () => {
    const frenchKaldi = {
      serviceName: "kaldi",
      model_type: "kaldi",
      language: "fr",
    }
    expect(
      names(
        filterTranscriptionServices([cohere, frenchKaldi, whisper], {
          language: "fr",
          hotwords: true,
        }),
      ),
    ).toEqual(["whisper"])
    expect(
      pick({ language: "fr", hotwords: true }, [frenchKaldi, whisper])
        .serviceName,
    ).toBe("whisper")
  })

  it("still proposes a service when none applies hotwords", () => {
    expect(pick({ language: "fr", hotwords: true }, [cohere]).serviceName).toBe(
      "cohere",
    )
  })

  it("puts diarization before hotwords", () => {
    const plainQwen = { ...qwen, sub_services: {} }
    const diarizingCohere = cohere
    expect(
      pick({ language: "fr", diarization: true, hotwords: true }, [
        plainQwen,
        diarizingCohere,
      ]).serviceName,
    ).toBe("cohere")
  })

  it("follows the rules whatever the services list beyond them", () => {
    const cohereListingAll = { ...cohere, language: "*,fr,en,pl" }
    const list = [cohereListingAll, whisper]
    expect(pick({ language: "pl" }, list).serviceName).toBe("whisper")
    expect(pick({ language: "*" }, list).serviceName).toBe("whisper")
    expect(pick({ language: "fr" }, list).serviceName).toBe("cohere")

    const detecting = { ...whisper, language: "*" }
    expect(
      pick({ language: "pl" }, [cohereListingAll, detecting]).serviceName,
    ).toBe("whisper")
    expect(
      pick({ language: "fr" }, [detecting, cohereListingAll]).serviceName,
    ).toBe("cohere")
  })

  it("prefers the service listing the language between two of the same model", () => {
    const detecting = { ...whisper, serviceName: "detecting", language: "*" }
    expect(pick({ language: "pl" }, [detecting, whisper]).serviceName).toBe(
      "whisper",
    )
  })

  it("only picks a model among the services able to take the request", () => {
    const cohereWithoutDiarization = { ...cohere, sub_services: {} }
    expect(
      pick({ language: "fr", diarization: true }, [
        cohereWithoutDiarization,
        qwen,
        whisper,
      ]).serviceName,
    ).toBe("qwen")
    expect(
      pick({ language: "fr" }, [{ ...cohere, language: "en" }, whisper]),
    ).toBe(whisper)
  })

  it("reads the model type regardless of case", () => {
    const upperCased = { ...cohere, model_type: " Cohere " }
    expect(pick({ language: "fr" }, [whisper, upperCased]).serviceName).toBe(
      "cohere",
    )
  })

  it("recognizes the model inside a longer declared type", () => {
    const hfQwen = { ...qwen, model_type: "qwen3_asr" }
    const hfCohere = {
      ...cohere,
      model_type: "CohereLabs/cohere-transcribe-03-2026",
    }
    const voxtral = { ...cohere, serviceName: "voxtral", model_type: "voxtral" }
    expect(
      pick({ language: "fr" }, [whisper, hfQwen, hfCohere]).serviceName,
    ).toBe("cohere")
    expect(
      pick({ language: "fr" }, [voxtral, whisper, hfQwen]).serviceName,
    ).toBe("qwen")
  })

  it("takes the first service listed when no model of the rule is running", () => {
    const kaldi = { serviceName: "kaldi", model_type: "kaldi", language: "pl" }
    const untyped = { serviceName: "untyped", language: "pl" }
    expect(pick({ language: "pl" }, [kaldi, untyped]).serviceName).toBe("kaldi")
    expect(pick({ language: "pl" }, [untyped, kaldi]).serviceName).toBe(
      "untyped",
    )
  })

  it("returns null without services", () => {
    expect(selectTranscriptionService([], { language: "fr" })).toBeNull()
  })
})

describe("selectGenericTranscriptionService", () => {
  it("takes the default model among the services detecting the language", () => {
    const detectingKaldi = {
      serviceName: "kaldi",
      model_type: "kaldi",
      language: "*",
    }
    expect(selectGenericTranscriptionService(services).serviceName).toBe(
      "whisper",
    )
    expect(
      selectGenericTranscriptionService([detectingKaldi, whisper, cohere])
        .serviceName,
    ).toBe("whisper")
    expect(
      selectGenericTranscriptionService([cohere, detectingKaldi]).serviceName,
    ).toBe("kaldi")
  })

  it("takes the default model among all services when none detects the language", () => {
    expect(selectGenericTranscriptionService([cohere, qwen]).serviceName).toBe(
      "qwen",
    )
  })

  it("returns null without services", () => {
    expect(selectGenericTranscriptionService([])).toBeNull()
  })
})
