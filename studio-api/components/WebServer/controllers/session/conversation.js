const debug = require("debug")(
  `linto:components:WebServer:controllers:session:conversation`,
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

const axios = require(`${process.cwd()}/lib/utility/axios`)

const { v4: uuidv4 } = require("uuid")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const DEFAULT_MEMBER_RIGHTS = RIGHTS.READ + RIGHTS.COMMENT
const SECURITY_LEVELS = require(
  `${process.cwd()}/lib/dao/conversation/securityLevels`,
)
const { storeFile, STORE_TYPE } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const {
  processChannelCaptions,
  dedupeClosedCaptionsBySegmentId,
} = require("./channelCaptions")

const { SessionError } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)

const { sessionReq } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
)

function getMembersRightFromVisibility(visibility) {
  return visibility === "private" ? RIGHTS.UNDEFINED : DEFAULT_MEMBER_RIGHTS
}

function extractSegmentFilter(transcriptionService) {
  const filter = {}
  const charSize = parseInt(transcriptionService.segmentCharSize, 10)
  const wordSize = parseInt(transcriptionService.segmentWordSize, 10)

  if (charSize > 0) filter.segmentCharSize = charSize
  if (wordSize > 0) filter.segmentWordSize = wordSize
  return filter
}

function extractTranslationTarget(translation) {
  return typeof translation === "string" ? translation : translation.target
}

function buildSessionChannels(session) {
  return (session.channels || []).map((channel) => ({
    name: channel.name,
    languages: channel.languages || [],
    translations: (channel.translations || []).map(extractTranslationTarget),
  }))
}

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
      membersRight: getMembersRightFromVisibility(session.visibility),
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
      session: {
        channels: buildSessionChannels(session),
      },
      ...(session.meta?.["@template"]
        ? { template: session.meta["@template"] }
        : {}),
    },
    jobs: {
      transcription: { state: "done" },
      keyword: {},
    },
    securityLevel: SECURITY_LEVELS.getValueOrDefault(
      session.meta?.securityLevel,
    ),
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
          const {
            serviceName,
            endpoint,
            lang,
            config,
            speakerIdentificationCollections,
          } = channel.meta.transcriptionService
          caption.metadata.transcription = {
            serviceName,
            endpoint,
            lang,
            transcriptionConfig: config,
            speakerIdentificationCollections,
          }
          caption.metadata.normalize.filter = extractSegmentFilter(
            channel.meta.transcriptionService,
          )
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

      if (
        !channel.closedCaptions ||
        channel.closedCaptions.every((cc) => cc.locutor === "bot")
      ) {
        continue
      }

      const caption = initializeCaption(
        session,
        channel,
        name,
        session.channels.length,
      )

      // Dual-recognizer sessions may emit two closedCaptions lines per
      // segmentId (one with the locutor, one with translations). Collapse
      // them so the translation merge below and processChannelCaptions are
      // deterministic and never produce duplicate turns.
      if (Array.isArray(channel.closedCaptions)) {
        channel.closedCaptions = dedupeClosedCaptionsBySegmentId(
          channel.closedCaptions,
        )
      }

      if (channel.translatedCaptions) {
        for (const segmentTranslations of Object.values(
          channel.translatedCaptions,
        )) {
          for (const tc of segmentTranslations) {
            const cc = channel.closedCaptions.find(
              (cc) => cc.segmentId === tc.segmentId,
            )
            if (cc) {
              if (!cc.translations || typeof cc.translations !== "object")
                cc.translations = {}
              cc.translations[tc.targetLang] = tc.text
            }
          }
        }
      }

      processChannelCaptions(channel, caption, true)

      for (const translation of channel.translations || []) {
        const targetLang = extractTranslationTarget(translation)
        const tlCaption = initializeCaption(
          session,
          channel,
          name,
          session.channels.length,
          targetLang,
        )
        processChannelCaptions(channel, tlCaption, false)
        tlCaption.parentCaptionId = caption.captionId
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
          const fileTransform = await storeFile(file, STORE_TYPE.AUDIO_SESSION)
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
  const captionId = uuidv4()
  let caption = {
    captionId,
    name: `${name} - ${channel.name}`,
    owner: session.owner,
    locale: channel.languages,
    organization: {
      organizationId: session.organizationId,
      membersRight: getMembersRightFromVisibility(session.visibility),
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
      session: {
        channels: buildSessionChannels(session),
      },
      normalize: { filter: {} },
      ...(session.meta?.["@template"]
        ? { template: session.meta["@template"] }
        : {}),
    },
    sharedWithUsers: [],
    description: "",
    securityLevel: SECURITY_LEVELS.getValueOrDefault(
      session.meta?.securityLevel,
    ),
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

async function storeSession(session, name = undefined) {
  try {
    const captions = await initCaptionsForConversation(session, name)
    let conversationMemory = []
    const { canonicalCount, translationCount } = countCaptions(captions)

    if (canonicalCount === 0) {
      logger.warn(
        `storeSession: session ${session.id} has no canonical captions after filtering, nothing stored`,
      )
      return
    }

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
      const { captionId: _cid, ...captionData } = caption
      result = await model.conversations.create(captionData)
      conversationMemory.push({
        convId: result.insertedId.toString(),
        name: caption.name,
        captionId: caption.captionId,
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
  // Single-channel sessions keep the offline transcription on a child caption;
  // mirror it onto the canonical parent.
  if (session.channels.length === 1) {
    const transcribed = captions.find(
      (caption) => caption.metadata?.transcription,
    )
    if (transcribed) {
      main_conversation.metadata.transcription =
        transcribed.metadata.transcription
    }
  }
  const offlineList = []
  for (let caption of captions) {
    if (caption.type.mode === TYPES.TRANSLATION) continue
    const { captionId: _cid, ...captionData } = caption
    let caption_result = await model.conversations.create(captionData)
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
      captionId: caption.captionId,
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
      (conv) => conv.captionId === caption.parentCaptionId,
    )
    caption.type = {
      ...caption.type,
      from_parent_id: parent.convId,
      from_canonical_id: result.insertedId.toString(),
    }

    const { captionId: _cid, parentCaptionId: _pcid, ...captionData } = caption
    const result_translation = await model.conversations.create(captionData)

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

const SESSION_STOP_TIMEOUT_MS =
  parseInt(process.env.SESSION_STOP_TIMEOUT_MS, 10) || 15000

// Stop (waitFinal drain barrier) before reading, so the GET sees every
// committed caption. Older Session APIs ignore waitFinal — never worse.
async function stopSessionAndFetch(sessionId) {
  try {
    await axios.put(
      process.env.SESSION_API_ENDPOINT +
        `/sessions/${sessionId}/stop?force=true&waitFinal=true`,
      {},
      { timeout: SESSION_STOP_TIMEOUT_MS },
    )
  } catch (err) {
    logger.warn(
      `stopSessionAndFetch: stop failed for session ${sessionId}, reading as-is: ${err?.message || err}`,
    )
  }
  return await axios.get(
    process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
  )
}

// Emit the new-conversation event, or warn when nothing was stored.
function emitConversationFromSession(
  ioHandler,
  session,
  result,
  sessionId,
  label,
) {
  if (result) {
    if (ioHandler !== undefined) {
      ioHandler.emit("new_conversation_from_session", {
        organizationId: session.organizationId,
        ...result,
      })
    }
  } else {
    logger.warn(
      `${label} ${sessionId} stopped with no storable captions, no conversation created`,
    )
  }
}

async function storeSessionFromStop(req, next) {
  try {
    const session = await stopSessionAndFetch(req.params.id)
    let result = await storeSession(session, req.query.name)

    emitConversationFromSession(
      this.app.components.IoHandler,
      session,
      result,
      req.params.id,
      "Session",
    )
    model.sessionData.deleteByOrganizationAndSession(
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
      const sessionCheck = await axios.get(
        process.env.SESSION_API_ENDPOINT +
          `/sessions/${req.params.id}?withCaptions=false`,
      )
      if (sessionCheck.owner === req.payload.data.userId) {
        const session = await stopSessionAndFetch(req.params.id)
        let result = await storeSession(session, req.query.name)

        emitConversationFromSession(
          this.app.components.IoHandler,
          session,
          result,
          req.params.id,
          "Quick meeting",
        )
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
  storeSession,
  storeSessionFromStop,
  storeQuickMeetingFromStop,
  initCaptionsForConversation,
}
