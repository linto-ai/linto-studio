const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:session:conversation`,
)

const axios = require(`${process.cwd()}/lib/utility/axios`)

const { v4: uuidv4 } = require("uuid")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const DEFAULT_MEMBER_RIGHTS = 3
const DEFAULT_SPEAKER_NAME = "Unknown speaker"
const DEFAULT_TRANSLATION_NAME = "Automatic Translation"
const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)
const { storeFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const { SessionError } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)

const { sessionReq } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
)

function initConversationMultiChannel(
  session,
  name = undefined,
  type = TYPES.CANONICAL,
) {
  return {
    name: name || session.name,
    owner: session.owner,
    locale: "",
    organization: {
      organizationId: session.organizationId,
      membersRight: DEFAULT_MEMBER_RIGHTS,
      customRights: [],
    },
    sharedWithUsers: [],
    type: {
      mode: type,
      from_session_id: session.id,
      child_conversations: [],
    },
    tags: [],
    metadata: {
      channel: {
        channel_count: session.channels.length,
        channel_start_time: session.startTime,
        channel_end_time: session.endTime,
      },
    },
    jobs: {
      transcription: { state: "done" },
      keyword: {},
    },
  }
}

function generateAudioMetadata(audioId, format = "mp3", folder = "session") {
  if (folder === "session") folder = process.env.VOLUME_AUDIO_SESSION_PATH
  else folder = process.env.VOLUME_AUDIO_PATH

  if (format === "wav") {
    return {
      filename: `${audioId}.wav`,
      duration: 0, // Duration generated when conversation is fetched
      mimetype: "audio/wav",
      filepath: `${folder}/${audioId}.wav`,
    }
  }
  // Default to mp3
  return {
    filename: `${audioId}.mp3`,
    duration: 0, // Duration generated when conversation is fetched
    mimetype: "audio/mpeg",
    filepath: `${folder}/${audioId}.mp3`,
  }
}

async function initCaptionsForConversation(sessionData, name) {
  try {
    const session = JSON.parse(JSON.stringify(sessionData))
    const captions = []
    name = name || session.name || ""

    for (let channel of session.channels) {
      const audioId = `${session.id}-${channel.id}`
      const audioFormat = channel.compressAudio ? "mp3" : "wav"
      if (
        !channel.compressAudio &&
        channel.keepAudio &&
        !(channel.meta === undefined || channel.meta === null)
      ) {
        try {
          const caption = initializeCaption(
            session,
            channel,
            name,
            session.channels.length,
          )

          caption.metadata.audio = generateAudioMetadata(audioId, audioFormat)
          const { serviceName, endpoint, lang, config } =
            channel.meta.transcriptionService
          caption.metadata.transcription = {
            serviceName,
            endpoint,
            lang,
            transcriptionConfig: config,
          }
          caption.jobs.transcription.state = "waiting"
          captions.push(caption)

          if (!channel.closedCaptions) {
            continue
          }
        } catch (err) {
          debug("Error initializing caption for channel with keepAudio:", err)
          // We still process the channel captions
        }
      }

      if (!channel.closedCaptions) continue
      const caption = initializeCaption(
        session,
        channel,
        name,
        session.channels.length,
      )

      processChannelCaptions(channel, caption, true)

      for (const translation of channel.translations || []) {
        const tlCaption = initializeCaption(
          session,
          channel,
          name,
          session.channels.length,
          translation,
        )
        processChannelCaptions(channel, tlCaption, false)
        tlCaption.parentName = caption.name
        captions.push(tlCaption)
      }

      if (channel.compressAudio && channel.keepAudio)
        caption.metadata.audio = generateAudioMetadata(audioId, audioFormat)
      if (!channel.compressAudio && channel.keepAudio) {
        if (channel.meta === undefined || channel.meta === null) {
          const file = {
            name: `${audioId}.${audioFormat}`,
            filepath: `${process.env.VOLUME_AUDIO_SESSION_PATH}/${audioId}.${audioFormat}`,
          }
          const fileTransform = await storeFile(file, "audio_session")
          caption.metadata.audio = generateAudioMetadata(
            fileTransform.filename.split(".")[0],
            "mp3",
            "audio",
          )
        } else {
          caption.metadata.audio = generateAudioMetadata(
            session.id,
            "mp3", //we force mp3, it's encoded in studio-api
            "audio",
          )
        }
      }
      captions.push(caption)
    }
    return captions
  } catch (err) {
    throw err
  }
}

function initializeCaption(
  session,
  channel,
  name,
  channelCount = 1,
  translation,
) {
  let caption = {
    name: `${name} - ${channel.name}`,
    owner: session.owner,
    locale: channel.languages,
    organization: {
      organizationId: session.organizationId,
      membersRight: DEFAULT_MEMBER_RIGHTS,
      customRights: [],
    },
    type: {
      mode: TYPES.CHILD,
      from_session_id: session.id,
      child_conversations: [],
    },
    speakers: [],
    text: [],
    tags: [],
    jobs: {
      transcription: { state: "done" },
      keyword: {},
    },
    metadata: {
      channel: {
        channel_count: session.channels.length,
        channel_start_time: session.startTime,
        channel_end_time: session.endTime,
      },
      normalize: { filter: {} },
    },
    sharedWithUsers: [],
    description: "",
  }

  if (channelCount === 1) {
    caption.name = `${name}`
  } else {
    caption.name = `${name} - ${channel.name}`
  }
  if (translation) {
    caption.name = `${name} - ${channel.name} - ${translation}`
    caption.locale = translation
    caption.type.mode = TYPES.TRANSLATION
  }

  return caption
}

function ensureSpeaker(caption, channel_caption) {
  let speakerName
  if (caption.type.mode === TYPES.TRANSLATION)
    speakerName = DEFAULT_TRANSLATION_NAME
  else if (channel_caption.locutor) speakerName = channel_caption.locutor
  else speakerName = DEFAULT_SPEAKER_NAME

  let existingSpeaker = caption.speakers.find(
    (speaker) => speaker.speaker_name === speakerName,
  )

  if (!existingSpeaker) {
    const newSpeaker = {
      speaker_id: uuidv4(),
      speaker_name: speakerName,
      stime: channel_caption.start,
      etime: channel_caption.end,
    }
    caption.speakers.push(newSpeaker)
    return newSpeaker.speaker_id
  }

  return existingSpeaker.speaker_id
}

function processChannelCaptions(channel, caption, main = true) {
  let closedCaptions = []
  let offset = 0
  channel.closedCaptions.map((segment) => {
    if (segment.locutor === "bot" && segment.aend) {
      // Calculate duration and add it to offset when caption was cut off
      const startDate = new Date(segment.astart)
      const endDate = new Date(segment.aend)
      const durationSeconds = (endDate - startDate) / 1000
      offset += durationSeconds
    } else {
      // Adjust timing for non-bot segments on multiple captions
      if (offset > 0) {
        segment.start = Number((segment.start + offset).toFixed(2))
        segment.end = Number((segment.end + offset).toFixed(2))
      }
      closedCaptions.push(segment) // Only push non-bot segments
    }
  })

  let prevSegmentWithTimestamps = undefined

  for (const channel_caption of closedCaptions) {
    let spk_id = ensureSpeaker(caption, channel_caption)
    if (channel_caption.locutor === "bot") {
      prevSegmentWithTimestamps = channel_caption
    }
    let turn = createTurn(
      channel_caption,
      spk_id,
      main,
      channel.diarization,
      caption,
      prevSegmentWithTimestamps,
    )
    if (!turn) continue
    caption.text.push(turn)
  }
}

function createTurn(
  channel_caption,
  spk_id,
  main,
  diarization = false,
  caption,
) {
  try {
    if (main && diarization && !channel_caption.locutor) {
      return
    }

    let turn = {
      speaker_id: spk_id,
      turn_id: uuidv4(),
      raw_segment: channel_caption.text,
      segment: channel_caption.text,
      stime: channel_caption.start,
      etime: channel_caption.end,
      lang: channel_caption.lang,
      words: [],
    }

    if (
      caption.type.mode === TYPES.TRANSLATION &&
      channel_caption?.translations[caption.locale]
    ) {
      turn.segment = channel_caption.translations[caption.locale]
      turn.raw_segment = channel_caption.translations[caption.locale]
    } else if (
      caption.type.mode === TYPES.TRANSLATION &&
      !channel_caption?.translations[caption.locale]
    ) {
      return
    }

    if (turn.raw_segment !== undefined) {
      turn.raw_segment.split(" ").forEach((word) => {
        turn.words.push({
          wid: uuidv4(),
          word: word,
        })
      })
    }

    return turn
  } catch (err) {
    return null
  }
}

async function storeSession(session, name = undefined) {
  try {
    const captions = await initCaptionsForConversation(session, name)
    let conversationMemory = []
    const { canonicalCount, translationCount } = countCaptions(captions)

    if (canonicalCount === 0) return

    const result =
      canonicalCount === 1
        ? await storeSingleConversation(captions, conversationMemory)
        : await storeMultiChannelConversation(
            captions,
            session,
            name,
            conversationMemory,
          )

    if (translationCount > 0) {
      await storeTranslations(captions, conversationMemory, result)
    }

    return result
  } catch (err) {
    throw err
  }
}

function countCaptions(captions) {
  let canonicalCount = 0
  let translationCount = 0
  for (let caption of captions) {
    if (caption.type.mode !== TYPES.TRANSLATION) {
      canonicalCount++ // count canonical & child
    } else {
      translationCount++ // count translations
    }
  }

  return { canonicalCount, translationCount }
}

function startOfflineJob(conversationId) {
  try {
    sessionReq(conversationId)
  } catch (err) {
    throw err
  }
}

async function storeSingleConversation(captions, conversationMemory) {
  let result
  for (let caption of captions) {
    if (caption.type.mode !== TYPES.TRANSLATION) {
      caption.type.mode = TYPES.CANONICAL
      result = await model.conversations.create(caption)
      conversationMemory.push({
        convId: result.insertedId.toString(),
        name: caption.name,
      })
      if (caption.jobs.transcription.state === "waiting") {
        startOfflineJob(result.insertedId.toString())
      }
    }
  }
  return result
}

async function storeMultiChannelConversation(
  captions,
  session,
  name,
  conversationMemory,
) {
  const main_conversation = initConversationMultiChannel(session, name)
  const offlineList = []
  for (let caption of captions) {
    if (caption.type.mode === TYPES.TRANSLATION) continue
    let caption_result = await model.conversations.create(caption)
    main_conversation.type.child_conversations.push(
      caption_result.insertedId.toString(),
    )
    await model.categories.createDefaultCategories(
      "keyword",
      caption_result.insertedId.toString(),
    )
    conversationMemory.push({
      convId: caption_result.insertedId.toString(),
      name: caption.name,
    })

    if (caption.jobs.transcription.state === "waiting") {
      offlineList.push(caption_result.insertedId.toString())
    }
  }

  let result = await model.conversations.create(main_conversation)
  await model.categories.createDefaultCategories(
    "keyword",
    result.insertedId.toString(),
  )

  await updateChildConversations(
    main_conversation.type.child_conversations,
    result.insertedId.toString(),
  )

  for (let childId of offlineList) {
    startOfflineJob(childId)
  }

  return result
}

async function updateChildConversations(childConversations, parentId) {
  for (let childId of childConversations) {
    await model.conversations.update({
      _id: childId,
      "type.from_canonical_id": parentId,
      "type.from_parent_id": parentId,
    })
  }
}

async function storeTranslations(captions, conversationMemory, result) {
  for (let caption of captions) {
    if (caption.type.mode !== TYPES.TRANSLATION) continue

    const parent = conversationMemory.find(
      (conv) => conv.name === caption.parentName,
    )
    caption.type = {
      ...caption.type,
      from_parent_id: parent.convId,
      from_canonical_id: result.insertedId.toString(),
    }

    const result_translation = await model.conversations.create(caption)

    const parentConv = await model.conversations.getById(parent.convId)
    parentConv[0].type.child_conversations.push(
      result_translation.insertedId.toString(),
    )
    await model.conversations.update(parentConv[0])
  }
}

async function storeProxyResponse(session) {
  try {
    if (typeof session === "string") {
      session = JSON.parse(session)
    }
    const conversation = await storeSession(session)

    return JSON.stringify({
      ...session,
      conversationId: conversation.insertedId.toString(),
    })
  } catch (err) {
    return session
  }
}

async function storeSessionFromStop(req, next) {
  try {
    const session = await axios.get(
      process.env.SESSION_API_ENDPOINT + `/sessions/${req.params.id}`,
    )
    await storeSession(session, req.query.name)

    model.sessionAlias.deleteByOrganizationAndSession(
      session.organizationId,
      req.params.id,
    )

    next()
  } catch (err) {
    next(err)
  }
}

async function storeQuickMeetingFromStop(req, next) {
  try {
    if (req.query.trash === "true") {
      next()
    } else {
      const session = await axios.get(
        process.env.SESSION_API_ENDPOINT + `/sessions/${req.params.id}`,
      )
      if (session.owner === req.payload.data.userId) {
        await storeSession(session, req.query.name)
        next()
      } else {
        throw new SessionError(
          "Quick meeting require to be the owner of the session",
        )
      }
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  storeProxyResponse,
  storeSessionFromStop,
  storeQuickMeetingFromStop,
}
