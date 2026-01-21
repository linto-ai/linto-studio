export const SECURITY_LEVELS = [0, 1, 2]

const TRANSCRIBER_PROFILES_TEMPLATES = {
  linto: {
    config: {
      type: "linto",
      name: "linto asr name",
      description: "asr description",
      languages: [
        {
          candidate: "fr-FR",
          endpoint: "ws://127.0.0.1:8080/streaming",
        },
      ],
      availableTranslations: [],
      hasDiarization: false,
    },
    quickMeeting: true,
    meta: {
      securityLevel: 0,
    },
  },
  microsoft: {
    config: {
      type: "microsoft",
      name: "microsoft asr name",
      description: "asr description",
      languages: [
        {
          candidate: "en-GB",
          endpoint: "endpoint-id",
        },
      ],
      region: "westeurope",
      key: "your_key",
      availableTranslations: [
        "ar",
        "eu",
        "bs",
        "bg",
        "zh",
        "zhh",
        "cs",
        "da",
        "nl",
        "en",
        "et",
        "fi",
        "fr",
        "gl",
        "de",
        "el",
        "hi",
        "hu",
        "id",
        "it",
        "ja",
        "ko",
        "lv",
        "lt",
        "mk",
        "nb",
        "pl",
        "pt",
        "ro",
        "ru",
        "sr",
        "sk",
        "sl",
        "es",
        "sv",
        "th",
        "tr",
        "uk",
        "vi",
        "cy",
      ],
      hasDiarization: true,
    },
    quickMeeting: true,
    meta: {
      securityLevel: 0,
    },
  },
}

export default TRANSCRIBER_PROFILES_TEMPLATES
