
const debug = require('debug')(`linto:conversation-manager:components:WebServer:session:conversation`)

const { v4: uuidv4 } = require('uuid')
const uuid = require('uuid')
const conversation = require('../../routes/api/taxonomy/conversation')

const model = require(`${process.cwd()}/lib/mongodb/models`)

const mock_session = {
    "id": "e86d8f8d-3265-4990-97e6-c9bdbff1be11",
    "status": "terminated",
    "name": "test session 2chan",
    "start_time": "2024-05-28T09:33:52.641Z",
    "end_time": "2024-05-28T09:35:41.602Z",
    "errored_on": null,
    "createdAt": "2024-05-28T09:33:27.037Z",
    "updatedAt": "2024-05-28T09:35:41.602Z",
    "channels": [
        {
            "transcriber_id": null,
            "languages": [
                "fr-FR"
            ],
            "name": "test channel fr",
            "stream_endpoint": "srt://127.0.0.1:8890?mode=caller",
            "stream_status": "inactive",
            "transcriber_status": "closed",
            "closed_captions": [
                {
                    "astart": "2024-05-28T09:34:41.254Z",
                    "text": "Bonjour, bienvenue à notre rendez-vous quotidien pour la presse en ligne et en direct sur EBS. Nous sommes aujourd'hui le jeudi 18 mars.",
                    "start": 0.37,
                    "end": 8.09,
                    "lang": "fr-FR",
                    "locutor": null
                },
                {
                    "astart": "2024-05-28T09:34:41.254Z",
                    "text": "J'aimerais commencer avec une mise à jour à l'agenda de la présidente. Demain en début d'après-midi, la présidente Sandrine et le président du Conseil européen Charles Michel rencontreront par visioconférence, le président de la Turquie Recep Tayyip Erdoğan pour faire le point des relations entre l'Union européenne et la Turquie dans le contexte de la préparation du Conseil européen de la semaine prochaine.",
                    "start": 8.97,
                    "end": 33.26,
                    "lang": "fr-FR",
                    "locutor": null
                },
                {
                    "astart": "2024-05-28T09:34:41.254Z",
                    "text": "Puis j'appelle maintenant Johannes, qui a de bonnes nouvelles pour les entrepreneurs européens cherchant des financements pour leurs idées innovantes. Johannes.",
                    "start": 34.75,
                    "end": 43.71,
                    "lang": "fr-FR",
                    "locutor": null
                },
                {
                    "astart": "2024-05-28T09:34:41.254Z",
                    "text": "Merci beaucoup Éric.",
                    "start": 46.87,
                    "end": 48.26,
                    "lang": "fr-FR",
                    "locutor": null
                }
            ],
            "closed_caption_live_delivery": "b235ac51-3f9b-42be-a512-1dd36bb9dea6",
            "closed_captions_file_delivery": null,
            "createdAt": "2024-05-28T09:33:27.088Z",
            "updatedAt": "2024-05-28T09:35:41.603Z",
            "transcriberProfileId": 6
        }
    ]
}

let turn = {
    "speaker_id": "c06114aa-e525-49ad-84c1-c0243d628ee2",
    "turn_id": "2507acdd-ac7d-4971-8417-1a9529ba64a8",
    "raw_segment": "thank you mr grémillet",
    "segment": "Thank you, Mr. Grémillet.",
    "words": [
        {
            "wid": "0ec646c4-8b44-4e77-8c55-399f1566004e",
            "stime": 494.69000000000005,
            "etime": 494.93,
            "word": "Thank",
            "confidence": 0.34
        },
        {
            "wid": "43a0225c-ed3e-467e-8c07-f878efb2d9f9",
            "stime": 494.93,
            "etime": 495.17,
            "word": "you,",
            "confidence": 1
        },
        {
            "wid": "d13f2060-976e-4ae7-abf0-acc831531187",
            "stime": 495.21000000000004,
            "etime": 495.33000000000004,
            "word": "Mr.",
            "confidence": 0.89
        },
        {
            "wid": "fce94d84-378c-4ff4-bb5f-178d10e20036",
            "stime": 495.77000000000004,
            "etime": 496.01,
            "word": "Grémillet.",
            "confidence": 0.88
        }
    ]
}

async function storeSession(sessionData) {
    try {
        const session = JSON.parse(JSON.stringify(sessionData))
        let conversation
        for (let channel of session.channels) {
            conversation = {
                name: session.name + ' - ' + channel.name,
                locale: channel.languages[0],
                organization: {
                    organizationId: '',
                    membersRight: '',
                    customRights: []
                },
                owner: '',
                sharedWithUsers: [],
                description: '',
                tags: [],
                speakers: [],
                text: [],
                metadata: {
                    type: 'session',
                    channel_count: session.channels.length,
                },
                jobs: {
                    transcription: {},
                    keyword: {}
                }
            }

            for (let caption of channel.closed_captions) {
                let spk_id = caption.locutor
                if (!caption.locutor) {
                    //TODO: we create the speaker
                    if (conversation.speakers.length === 0) {
                        conversation.speakers.push({
                            speaker_id: uuidv4(),
                            speaker_name: 'chanel',
                            stime: caption.start,
                            etime: caption.end
                        })
                    }
                    spk_id = conversation.speakers[0].speaker_id
                }
                let turn = {
                    speaker_id: spk_id,
                    turn_id: uuidv4(),
                    raw_segment: caption.text,
                    segment: caption.text,
                    stime: caption.start,
                    etime: caption.end,
                    words: []
                }
                caption.text.split(' ').map(word => turn.words.push({
                    wid: uuidv4(),
                    word: word,
                    // stime: 0,
                    // etime: 0,
                    // confidence: 1
                })
                )

                conversation.text.push(turn)
            }

        }
        debug(conversation)
        return conversation

    } catch (err) {
    }
}

function initConversation(metadata, userId, job_id) {

    let transcriptionConfig = metadata.transcriptionConfig
    try {
        transcriptionConfig = JSON.parse(metadata.transcriptionConfig)
    } catch (err) {
    }


    let conversation = {
        name: metadata.name,
        description: metadata.description,
        owner: userId,
        sharedWithUsers: [],
        organization: {
            organizationId: metadata.organizationId,
            membersRight: metadata.membersRight,
            customRights: []
        },
        tags: [],
        speakers: [],
        text: [],
        metadata: {
            transcription: {
                lang: metadata.lang,
                transcriptionConfig: transcriptionConfig,
            },
            normalize: { filter: {} },
            audio: {},
            file: {}
        },
        locale: metadata.lang,
        jobs: {
            transcription: {
                job_id: job_id,
                state: 'pending',
                steps: {},
                endpoint: metadata.endpoint,
            },
            keyword: {}
        }
    }

    if (metadata.sharedWithUsers) conversation.sharedWithUsers = metadata.sharedWithUsers
    if (metadata.segmentWordSize) conversation.metadata.normalize.filter.segmentWordSize = metadata.segmentWordSize
    if (metadata.segmentCharSize) conversation.metadata.normalize.filter.segmentCharSize = metadata.segmentCharSize

    return conversation
}

module.exports = {
    storeSession
}
