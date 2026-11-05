import test from "ava"
import { buildBotRequest } from "../buildBotRequest.js"
import { buildConversationRequest } from "../buildConversationRequest.js"
import { buildQuickSessionRequest } from "../buildQuickSessionRequest.js"
import { buildServiceConfig } from "../buildServiceConfig.js"
import { createDraft } from "../createDraft.js"
import {
  bilingualProfile,
  frenchProfile,
  kaldiService,
  whisperService,
} from "./helpers/fixtures.js"

function microphoneDraft(choices) {
  return {
    ...createDraft({ source: "microphone", securityLevel: 1 }),
    membersRight: 3,
    ...choices,
  }
}

const engines = { profile: bilingualProfile, service: whisperService }

test("punctuation is built in or the first sub-service, never asked", (t) => {
  const draft = microphoneDraft({ languages: ["fr"] })
  const whisper = buildServiceConfig(draft, whisperService)
  t.false(whisper.config.punctuationConfig.enablePunctuation)
  const kaldi = buildServiceConfig(draft, kaldiService)
  t.true(kaldi.config.punctuationConfig.enablePunctuation)
  t.is(kaldi.config.punctuationConfig.serviceName, "punctuation-fr")
})

test("the service gets its own spelling of the language", (t) => {
  const config = buildServiceConfig(
    microphoneDraft({ languages: ["fr"] }),
    whisperService,
  )
  t.is(config.lang, "fr-FR")
  t.is(config.config.language, "fr-FR")
})

test("speakers settings reach the diarization config", (t) => {
  const configFor = (speakers) =>
    buildServiceConfig(
      microphoneDraft({
        speakers: {
          isSeparated: true,
          count: null,
          collectionIds: [],
          ...speakers,
        },
      }),
      whisperService,
    )

  const none = configFor({ isSeparated: false, collectionIds: ["team"] })
  t.false(none.config.diarizationConfig.enableDiarization)
  t.deepEqual(none.speakerIdentificationCollections, [])

  const distinguish = configFor({})
  t.is(distinguish.config.diarizationConfig.serviceName, "pyannote")
  t.is(distinguish.config.diarizationConfig.numberOfSpeaker, null)
  t.deepEqual(distinguish.speakerIdentificationCollections, [])

  const fixed = configFor({ count: 4 })
  t.is(fixed.config.diarizationConfig.numberOfSpeaker, 4)

  const recognize = configFor({ collectionIds: ["team", "organization"] })
  t.is(recognize.config.diarizationConfig.serviceName, "pyannote-id")
  t.deepEqual(recognize.speakerIdentificationCollections, [
    "team",
    "organization",
  ])
})

test("conversation request: a file goes as a track", (t) => {
  const file = { value: "meeting", file: "binary" }
  const request = buildConversationRequest(
    microphoneDraft({ folderId: "folder" }),
    whisperService,
    file,
  )
  t.is(request.name, "meeting")
  t.is(request.membersRight, 3)
  t.is(request.securityLevel, 1)
  t.is(request.folderId, "folder")
  t.is(request.serviceName, "whisper")
  t.is(request.endpoint, "whisper/transcribe")
  t.deepEqual(request.tracks, ["binary"])
  t.is(JSON.parse(request.transcriptionConfig).language, "*")
})

test("quick session, both: live profile, chosen translations, end service", (t) => {
  const { channels, meta } = buildQuickSessionRequest(
    microphoneDraft({ translations: ["es"] }),
    engines,
  )
  t.is(channels[0].transcriberProfileId, "bilingual")
  t.deepEqual(channels[0].translations, ["es"])
  t.true(channels[0].enableLiveTranscripts)
  t.false(channels[0].compressAudio)
  t.is(channels[0].meta.transcriptionService.serviceName, "whisper")
  t.deepEqual(meta, { securityLevel: 1, membersRight: 3 })
})

test("quick session, live only: no end service, keepAudio as chosen", (t) => {
  const { channels } = buildQuickSessionRequest(
    microphoneDraft({ timing: "live", keepAudio: false }),
    engines,
  )
  t.false(channels[0].keepAudio)
  t.true(channels[0].compressAudio)
  t.is(channels[0].meta.transcriptionService, null)
})

test("quick session, at the end: audio only", (t) => {
  const { channels } = buildQuickSessionRequest(
    microphoneDraft({ timing: "offline", keepAudio: false }),
    engines,
  )
  t.false(channels[0].enableLiveTranscripts)
  t.true(channels[0].keepAudio)
  t.is(channels[0].transcriberProfileId, undefined)
})

test("quick session: live separates speakers only if the profile can", (t) => {
  const diarization = (choices, profile = bilingualProfile) =>
    buildQuickSessionRequest(microphoneDraft(choices), {
      profile,
      service: whisperService,
    }).channels[0].diarization
  t.true(diarization({}))
  t.false(diarization({}, frenchProfile))
  t.false(
    diarization({
      speakers: { isSeparated: false, count: null, collectionIds: [] },
    }),
  )
})

test("quick session: recognition stays plain diarization in live", (t) => {
  const { channels } = buildQuickSessionRequest(
    microphoneDraft({
      speakers: { isSeparated: true, count: null, collectionIds: ["team"] },
    }),
    engines,
  )
  t.true(channels[0].diarization)
  const service = channels[0].meta.transcriptionService
  t.deepEqual(service.speakerIdentificationCollections, ["team"])
})

function visioDraft(choices) {
  return {
    ...createDraft({ source: "visio", securityLevel: 1 }),
    visio: {
      url: " https://meet.jit.si/Room ",
      provider: "jitsi",
      showSubtitles: true,
      subtitleSource: "de",
    },
    ...choices,
  }
}

test("bot request: trims the URL and keeps its case", (t) => {
  const request = buildBotRequest(visioDraft(), "channel")
  t.is(request.url, "https://meet.jit.si/Room")
  t.is(request.channelId, "channel")
  t.is(request.provider, "jitsi")
})

test("bot request: subtitles follow the choice in live", (t) => {
  const request = buildBotRequest(visioDraft(), "channel")
  t.true(request.enableDisplaySub)
  t.is(request.subSource, "de")
})

test("bot request: the original language is no source", (t) => {
  const draft = visioDraft()
  draft.visio.subtitleSource = "original"
  t.is(buildBotRequest(draft, "channel").subSource, null)
})

test("bot request: no live, no subtitles", (t) => {
  const request = buildBotRequest(visioDraft({ timing: "offline" }), "channel")
  t.false(request.enableDisplaySub)
  t.is(request.subSource, null)
})
