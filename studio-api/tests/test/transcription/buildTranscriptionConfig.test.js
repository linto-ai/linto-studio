const { buildTranscriptionConfig } = require(
  `${process.cwd()}/lib/transcription/buildTranscriptionConfig`,
)

const whisper = {
  model_type: "whisper",
  sub_services: { diarization: [{ service_name: "pyannote" }] },
}
const kaldi = {
  model_type: "kaldi",
  sub_services: { punctuation: [{ service_name: "punct-fr" }] },
}

describe("buildTranscriptionConfig", () => {
  it("keeps the client's choices and sets what depends on the service", () => {
    const config = buildTranscriptionConfig(whisper, {
      language: "fr-FR",
      config: {
        language: "fr",
        modelType: "kaldi",
        enableNormalization: false,
        punctuationConfig: { enablePunctuation: true, serviceName: "punct-fr" },
        diarizationConfig: {
          enableDiarization: true,
          numberOfSpeaker: 3,
          maxNumberOfSpeaker: 10,
          serviceName: "other-diarization",
        },
        vadConfig: { enableVAD: false, methodName: "WebRTC", minDuration: 0 },
      },
    })
    expect(config.language).toBe("fr-FR")
    expect(config.modelType).toBe("whisper")
    expect(config.enableNormalization).toBe(false)
    expect(config.punctuationConfig).toEqual({
      enablePunctuation: false,
      serviceName: null,
    })
    expect(config.diarizationConfig).toEqual({
      enableDiarization: true,
      numberOfSpeaker: 3,
      maxNumberOfSpeaker: 10,
      serviceName: "pyannote",
    })
    expect(config.vadConfig).toEqual({
      enableVAD: false,
      methodName: "WebRTC",
      minDuration: 30,
    })
  })

  it("carries the server-built speaker identification config", () => {
    const speakerIdentificationConfig = { collections: ["c1"] }
    const config = buildTranscriptionConfig(whisper, {
      language: "*",
      config: {
        diarizationConfig: {
          enableDiarization: true,
          speakerIdentificationConfig,
        },
      },
    })
    expect(config.diarizationConfig).toEqual({
      enableDiarization: true,
      numberOfSpeaker: null,
      maxNumberOfSpeaker: 100,
      serviceName: "pyannote",
      speakerIdentificationConfig,
    })
  })

  it("fills the defaults without a client config", () => {
    const config = buildTranscriptionConfig(kaldi, { language: "fr-FR" })
    expect(config).toEqual({
      enableNormalization: true,
      language: "fr-FR",
      modelType: "kaldi",
      punctuationConfig: { enablePunctuation: true, serviceName: "punct-fr" },
      diarizationConfig: {
        enableDiarization: false,
        numberOfSpeaker: null,
        maxNumberOfSpeaker: null,
        serviceName: null,
      },
      vadConfig: { enableVAD: true, methodName: "WebRTC", minDuration: 0 },
    })
  })

  it("disables diarization when not asked or not offered", () => {
    const notAsked = buildTranscriptionConfig(whisper, {
      language: "*",
      config: {
        diarizationConfig: { enableDiarization: false, numberOfSpeaker: 2 },
      },
    }).diarizationConfig
    expect(notAsked.enableDiarization).toBe(false)
    expect(notAsked.numberOfSpeaker).toBeNull()
    const notOffered = buildTranscriptionConfig(kaldi, {
      language: "fr-FR",
      config: { diarizationConfig: { enableDiarization: true } },
    }).diarizationConfig
    expect(notOffered.enableDiarization).toBe(false)
    expect(notOffered.serviceName).toBeNull()
  })

  it("leaves punctuation off when the client disabled it on another model", () => {
    const config = buildTranscriptionConfig(kaldi, {
      language: "fr-FR",
      config: { punctuationConfig: { enablePunctuation: false } },
    })
    expect(config.punctuationConfig).toEqual({
      enablePunctuation: false,
      serviceName: null,
    })
  })
})
