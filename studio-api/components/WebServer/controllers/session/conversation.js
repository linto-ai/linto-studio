const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:session:conversation`,
)

const axios = require(`${process.cwd()}/lib/utility/axios`)

const { v4: uuidv4 } = require("uuid")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const DEFAULT_MEMBER_RIGHTS = 3
const DEFAULT_SPEAKER_NAME = "Unknown speaker"

const { SessionError } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)

function initConversationMultiChannel(
  session,
  name = undefined,
  type = "canonical",
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
      let caption = {
        name: name + " - " + channel.name,
        owner: session.owner,
        locale: channel.languages,
        organization: {
          organizationId: session.organizationId,
          membersRight: DEFAULT_MEMBER_RIGHTS,
          customRights: [],
        },
        type: {
          mode: "child",
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
        tags: [],
        description: "",
      }

      for (let channel_caption of channel.closedCaptions) {
        let spk_id = caption.locutor

        if (!caption.locutor) {
          caption.locutor = DEFAULT_SPEAKER_NAME
        }

        let existingSpeaker = caption.speakers.find(
          (speaker) => speaker.speaker_name === caption.locutor,
        )
        if (!existingSpeaker) {
          caption.speakers.push({
            speaker_id: uuidv4(),
            speaker_name: caption.locutor || DEFAULT_SPEAKER_NAME,
            stime: channel_caption.start,
            etime: channel_caption.end,
          })
          spk_id = caption.speakers[caption.speakers.length - 1].speaker_id
        } else {
          spk_id = existingSpeaker.speaker_id
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
        channel_caption.text.split(" ").map((word) =>
          turn.words.push({
            wid: uuidv4(),
            word: word,
          }),
        )
        caption.text.push(turn)
      }
      captions.push(caption)
    }
    return captions
  } catch (err) {
    throw err
  }
}

async function storeSession(session, name = undefined) {
  try {
    const captions = initCaptionsForConversation(session, name)

    if (captions.length === 0) {
      return
    } else if (captions.length === 1) {
      captions[0].type.mode = "canonical"
      const result = await model.conversations.create(captions[0])
      return result
    } else {
      const conversation_multi_channel = initConversationMultiChannel(
        session,
        name,
      )

      for (let caption of captions) {
        const result = await model.conversations.create(caption)
        conversation_multi_channel.type.child_conversations.push(
          result.insertedId.toString(),
        )
        await model.categories.createDefaultCategories(
          "keyword",
          result.insertedId.toString(),
        )
      }
      const result = await model.conversations.create(
        conversation_multi_channel,
      )
      await model.categories.createDefaultCategories(
        "keyword",
        result.insertedId.toString(),
      )

      const parentId = result.insertedId.toString()
      for (let childId of conversation_multi_channel.type.child_conversations) {
        await model.conversations.update({
          _id: childId,
          "type.from_parent_id": parentId,
        })
      }

      return result
    }
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
  storeSession,
  storeProxyResponse,
  storeSessionFromStop,
  storeQuickMeetingFromStop,
}
