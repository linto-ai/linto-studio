const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:session:conversation`,
)

const axios = require(`${process.cwd()}/lib/utility/axios`)

const { v4: uuidv4 } = require("uuid")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const DEFAULT_MEMBER_RIGHTS = 3
const DEFAULT_SPEAKER_NAME = "Unknown speaker"
const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)

const { SessionError } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
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

function initCaptionsForConversation(sessionData, name = undefined) {
  try {
    const session = JSON.parse(JSON.stringify(sessionData))
    let captions = []

    for (let channel of session.channels) {
      if (!channel.closedCaptions) {
        continue
      }

      if (name === undefined) {
        name = session.name || ""
      }

      let caption = initializeCaption(session, channel, name)
      processChannelCaptions(channel.closedCaptions, caption)
      if (channel.translations && channel.translations.length > 0) {
        for (let tl of channel.translations) {
          let tlCaption = initializeCaption(session, channel, name, tl)
          processChannelCaptions(channel.closedCaptions, tlCaption, tl)

          tlCaption.parentName = caption.name
          captions.push(tlCaption)
        }
      }
      captions.push(caption)
    }

    return captions
  } catch (err) {
    throw err
  }
}

function initializeCaption(session, channel, name, translation) {
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
    },
    sharedWithUsers: [],
    description: "",
  }

  if (translation) {
    caption.name = `${name} - ${channel.name} - ${translation}`
    caption.locale = translation
    caption.type.mode = TYPES.TRANSLATION
  }

  return caption
}

function processChannelCaptions(closedCaptions, caption, translation = "") {
  for (let channel_caption of closedCaptions) {
    let spk_id = ensureSpeaker(caption, channel_caption)

    let turn = createTurn(channel_caption, spk_id, translation)
    caption.text.push(turn)
  }
}

function ensureSpeaker(caption, channel_caption) {
  if (!caption.locutor) {
    caption.locutor = DEFAULT_SPEAKER_NAME
  }

  let existingSpeaker = caption.speakers.find(
    (speaker) => speaker.speaker_name === caption.locutor,
  )

  if (!existingSpeaker) {
    const newSpeaker = {
      speaker_id: uuidv4(),
      speaker_name: caption.locutor || DEFAULT_SPEAKER_NAME,
      stime: channel_caption.start,
      etime: channel_caption.end,
    }
    caption.speakers.push(newSpeaker)
    return newSpeaker.speaker_id
  }

  return existingSpeaker.speaker_id
}

function createTurn(channel_caption, spk_id, translation = "") {
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
  if (translation !== "") {
    turn.segment =
      channel_caption.translations[translation] || channel_caption.text
    turn.raw_segment =
      channel_caption.translations[translation] || channel_caption.text
  }

  turn.raw_segment.split(" ").forEach((word) => {
    turn.words.push({
      wid: uuidv4(),
      word: word,
    })
  })

  return turn
}

async function storeSession(session, name = undefined) {
  try {
    let result
    const captions = initCaptionsForConversation(session, name)
    let conversationMemory = []

    let count = 0
    let translationCount = 0
    for (let caption of captions) {
      if (caption.type.mode !== TYPES.TRANSLATION) {
        count++
      } else {
        translationCount++
      }
    }

    if (count === 0) {
      return
    } else if (count === 1) {
      for (let caption of captions) {
        if (caption.type.mode !== TYPES.TRANSLATION) {
          caption.type.mode = TYPES.CANONICAL
          result = await model.conversations.create(caption)
          conversationMemory.push({
            convId: result.insertedId.toString(),
            name: caption.name,
          })
        }
      }
    } else {
      const conversation_multi_channel = initConversationMultiChannel(
        session,
        name,
      )

      for (let caption of captions) {
        if (caption.type.mode === TYPES.TRANSLATION) {
          continue
        }
        const result = await model.conversations.create(caption)
        conversation_multi_channel.type.child_conversations.push(
          result.insertedId.toString(),
        )
        await model.categories.createDefaultCategories(
          "keyword",
          result.insertedId.toString(),
        )
        conversationMemory.push({
          convId: result.insertedId.toString(),
          name: caption.name,
        })
      }
      result = await model.conversations.create(conversation_multi_channel)
      await model.categories.createDefaultCategories(
        "keyword",
        result.insertedId.toString(),
      )

      const parentId = result.insertedId.toString()
      for (let childId of conversation_multi_channel.type.child_conversations) {
        await model.conversations.update({
          _id: childId,
          "type.from_canonical_id": parentId,
          "type.from_parent_id": parentId,
        })
      }
    }

    if (translationCount > 0) {
      for (let caption of captions) {
        if (caption.type.mode === TYPES.TRANSLATION) {
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
    }

    return result
  } catch (err) {
    throw err
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
