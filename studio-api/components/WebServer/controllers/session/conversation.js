const debug = require('debug')(`linto:conversation-manager:components:WebServer:session:conversation`)

const { v4: uuidv4 } = require('uuid')

const model = require(`${process.cwd()}/lib/mongodb/models`)
const DEFAULT_MEMBER_RIGHTS = '3'

function initConversationMultiChannel(session, type = 'canonical') {
    return {
        name: session.name,
        owner: session.owner,
        locale: '',
        organization: {
            organizationId: session.organizationId,
            membersRight: DEFAULT_MEMBER_RIGHTS,
            customRights: []
        },
        sharedWithUsers: [],
        type: {
            mode: type,
            from_session_id: session.id,
            channel_count: session.channels.length,
            child_conversations: []
        },
        tags:[],
        jobs: {
            transcription: { state: 'done' },
            keyword: {}
        }
    }
}

function initCaptionsForConversation(sessionData) {
    try {
        const session = JSON.parse(JSON.stringify(sessionData))
        let captions = []
        for (let channel of session.channels) {
            if (!channel.closed_captions) {
                continue
            }

            let caption = {
                name: session.name + ' - ' + channel.name,
                owner: session.owner,
                locale: channel.languages,
                organization: {
                    organizationId: session.organizationId,
                    membersRight: DEFAULT_MEMBER_RIGHTS,
                    customRights: []
                },
                type: {
                    mode: 'child',
                    from_session_id: session.id,
                    channel_count: session.channels.length,
                    child_conversations: []
                },
                speakers: [],
                text: [],

                tags:[],
                jobs: {
                    transcription: { state: 'done' },
                    keyword: {}
                },
                metadata: {},
                sharedWithUsers: [],
                tags: [],
                description: '',
            }

            for (let channel_caption of channel.closed_captions) {
                let spk_id = caption.locutor
                if (!caption.locutor) {
                    if (caption.speakers.length === 0) {
                        caption.speakers.push({
                            speaker_id: uuidv4(),
                            speaker_name: 'chanel',
                            stime: channel_caption.start,
                            etime: channel_caption.end
                        })
                    }
                    spk_id = caption.speakers[0].speaker_id
                }
                let turn = {
                    speaker_id: spk_id,
                    turn_id: uuidv4(),
                    raw_segment: channel_caption.text,
                    segment: channel_caption.text,
                    stime: channel_caption.start,
                    etime: channel_caption.end,
                    words: []
                }
                channel_caption.text.split(' ').map(word => turn.words.push({
                    wid: uuidv4(),
                    word: word,
                }))
                caption.text.push(turn)
            }
            captions.push(caption)
        }
        return captions
    } catch (err) {
        debug(err)
    }
}

async function storeSession(session) {
    try {
        const captions = initCaptionsForConversation(session)

        if (captions.length === 0) {
            return
        } else if (captions.length === 1) {
            captions[0].type.mode = 'canonical'
            model.conversations.create(captions[0])
            return captions[0]
        } else {
            const conversation_multi_channel = initConversationMultiChannel(session)

            for (let caption of captions) {
                const result = await model.conversations.create(caption)
                conversation_multi_channel.type.child_conversations.push(result.insertedId.toString())
            }
            const result = await model.conversations.create(conversation_multi_channel)
            return conversation_multi_channel
        }

    } catch (err) {
        debug(err)
    }
}


module.exports = {
    storeSession
}
