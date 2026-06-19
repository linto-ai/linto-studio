const debug = require("debug")(
  "linto:components:WebServer:controllers:conversation:generator",
)

const { v4: uuidv4 } = require("uuid")
const uuid = require("uuid")

const fs = require("fs")
const mm = require("music-metadata")

const SECURITY_LEVELS = require(
  `${process.cwd()}/lib/dao/conversation/securityLevels`,
)

//Parse the stt transcription to for conversation mongodb model
function initConversation(metadata, userId, job_id) {
  let transcriptionConfig = metadata.transcriptionConfig
  try {
    transcriptionConfig = JSON.parse(metadata.transcriptionConfig)
  } catch (err) {}

  let conversation = {
    name: metadata.name,
    description: metadata.description,
    owner: userId,
    sharedWithUsers: [],
    organization: {
      organizationId: metadata.organizationId,
      membersRight: metadata.membersRight,
      customRights: [],
    },
    tags: [],
    speakers: [],
    text: [],
    type: {
      mode: "canonical",
      child_conversations: [],
    },
    metadata: {
      transcription: {
        lang: metadata.lang,
        transcriptionConfig: transcriptionConfig,
      },
      normalize: { filter: {} },
      audio: {},
      file: {},
    },
    locale: metadata.lang,
    jobs: {
      transcription: {
        job_id: job_id,
        state: "pending",
        steps: {},
        endpoint: metadata.endpoint,
      },
      keyword: {},
    },
  }

  if (metadata.sharedWithUsers)
    conversation.sharedWithUsers = metadata.sharedWithUsers
  conversation.securityLevel = SECURITY_LEVELS.getValueOrDefault(
    metadata.securityLevel,
  )
  if (metadata.folderId) conversation.folderId = metadata.folderId
  if (metadata.segmentWordSize)
    conversation.metadata.normalize.filter.segmentWordSize =
      metadata.segmentWordSize
  if (metadata.segmentCharSize)
    conversation.metadata.normalize.filter.segmentCharSize =
      metadata.segmentCharSize

  return conversation
}

// Detect whether speaker identification was requested for this conversation
function speakerIdentificationRequested(conversation) {
  const config = conversation?.metadata?.transcription?.transcriptionConfig
  return Boolean(config?.diarizationConfig?.speakerIdentificationConfig)
}

// Map worker speaker name -> identification confidence score (Q7)
function buildScoreMap(transcript) {
  const scores = {}
  if (Array.isArray(transcript.diarization_speakers)) {
    for (const s of transcript.diarization_speakers) {
      if (s && s.spk_id !== undefined && s.spk_id_score !== undefined) {
        scores[s.spk_id] = s.spk_id_score
      }
    }
  }
  return scores
}

// A diarization tag that was not identified ("spk1", "spk2", ... or a raw UUID)
function isUnidentifiedTag(name) {
  return /^spk\d+$/i.test(name) || uuid.validate(name)
}

function transcriptionToConversation(transcript, conversation) {
  try {
    jsonTranscript = transcript

    if (
      transcript === undefined ||
      transcript.transcription_result.length === 0
    )
      throw new Error("Transcription was empty")
    conversation.metadata.transcription.confidence = transcript.confidence

    transcript.segments.map((segment) => {
      /* Check and init speaker */
      if (segment.spk_id === null) {
        segment.spk_id = "speaker"
      }

      let speaker = conversation.speakers.filter(
        (speaker) => speaker.speaker_name === segment.spk_id,
      )
      if (speaker.length === 0) {
        // Add speaker if not found
        speaker = {
          speaker_id: uuidv4(),
          speaker_name: segment.spk_id,
          stime: segment.start,
          etime: segment.end,
        }
        if (!speaker.speaker_name) speaker.speaker_name = "speaker"
        conversation.speakers.push(speaker)
      } else speaker = speaker[0]

      let text_segment = {
        speaker_id: speaker.speaker_id,
        turn_id: uuidv4(),
        raw_segment: segment.raw_segment.toLowerCase(),
        segment: segment.segment,
        words: [],
      }
      if (segment.language) text_segment.language = segment.language

      segment.words.map((word) => {
        text_segment.words.push({
          wid: uuidv4(),
          stime: word.start,
          etime: word.end,
          word: word.word,
          confidence: word.conf,
        })
      })
      conversation.text.push(text_segment)
    })

    if (speakerIdentificationRequested(conversation)) {
      // Speaker identification mode: attach the confidence score to identified
      // speakers (Q7) and rename the unidentified ones to "Unknown speaker N"
      // (Q1). Identified speakers keep their label/member name.
      const scores = buildScoreMap(transcript)
      let unknown_num = 1
      conversation.speakers.map((speaker) => {
        if (scores[speaker.speaker_name] !== undefined) {
          speaker.identification_score = scores[speaker.speaker_name]
        }
        if (isUnidentifiedTag(speaker.speaker_name)) {
          speaker.speaker_name = "Unknown speaker " + unknown_num
          unknown_num++
        }
      })
    } else {
      let speaker_num = 1
      conversation.speakers.map((speaker) => {
        if (uuid.validate(speaker.speaker_name)) {
          speaker.speaker_name = "speaker" + speaker_num
          speaker_num++
        }
      })
    }
    return conversation
  } catch (err) {
    throw err
  }
}

// Add file metadata to the conversation object
async function addFileMetadataToConversation(conversation, file, endpoint) {
  const file_metadata = await mm.parseStream(
    fs.createReadStream(file.storageFilePath),
    { mimeType: "audio/mpeg" },
  )
  delete file_metadata.native

  conversation.metadata.audio = {
    filename: file.filename,
    duration: file_metadata.format.duration,
    mimetype: "audio/mpeg", // mp3
    filepath: file.filePath,
  }

  conversation.metadata.file = { ...file_metadata }
  conversation.metadata.transcription.endpoint = endpoint
  return conversation
}

async function addAudioDuration(conversation, file) {
  const file_metadata = await mm.parseStream(
    fs.createReadStream(file.storageFilePath),
    { mimeType: "audio/mpeg" },
  )
  delete file_metadata.native
  if (!conversation.metadata.audio) {
    conversation.metadata.audio = {}
  }
  conversation.metadata.audio.duration = file_metadata.format.duration
  return conversation
}

module.exports = {
  transcriptionToConversation,
  addFileMetadataToConversation,
  addAudioDuration,
  initConversation,
}
