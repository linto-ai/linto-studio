export const bilingualProfile = {
  id: "bilingual",
  config: {
    name: "Bilingue",
    languages: [{ candidate: "fr-FR" }, { candidate: "en-GB" }],
    availableTranslations: { discrete: ["en", "es"], external: [] },
    hasDiarization: true,
  },
  meta: { securityLevel: 2 },
}

export const frenchProfile = {
  id: "french",
  config: {
    name: "Français",
    languages: [{ candidate: "fr-FR" }],
    availableTranslations: ["en"],
    hasDiarization: false,
  },
  meta: { securityLevel: 2 },
}

export const europeProfile = {
  id: "europe",
  config: {
    name: "Europe",
    languages: [
      { candidate: "fr-FR" },
      { candidate: "de-DE" },
      { candidate: "it-IT" },
    ],
    availableTranslations: ["de", "ar"],
    hasDiarization: true,
  },
  meta: { securityLevel: 0 },
}

export const whisperService = {
  serviceName: "whisper",
  model_type: "whisper",
  language: "*,fr-FR,en-US",
  security_level: 2,
  order: 2,
  endpoints: [{ endpoint: "/whisper/transcribe" }],
  sub_services: {
    diarization: [
      { service_name: "pyannote", info: {} },
      { service_name: "pyannote-id", info: { speaker_identification: true } },
    ],
    punctuation: [{ service_name: "ignored" }],
  },
}

export const kaldiService = {
  serviceName: "kaldi",
  model_type: "kaldi",
  language: "fr-FR",
  security_level: 2,
  order: 1,
  endpoints: [{ endpoint: "/kaldi/transcribe" }],
  sub_services: {
    diarization: [],
    punctuation: [{ service_name: "punctuation-fr" }],
  },
}

export const catalog = {
  profiles: [frenchProfile, bilingualProfile, europeProfile],
  services: [kaldiService, whisperService],
  collections: [
    { _id: "team", type: "user" },
    { _id: "organization", type: "organization" },
  ],
  speakerIdentificationEnabled: true,
}
