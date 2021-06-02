const debug = require('debug')('linto:components:WebServer:controller:request')

const { v4: uuidv4 } = require('uuid');
const mm = require('music-metadata')
const moment = require('moment')

//Parse the stt transcription to for conversation mongodb model
function sttToConversation(transcript, metadata) {
    const dateTime = moment().format()

    let conversation = {
        name: metadata.name,
        description: metadata.description,
        conversationType: metadata.conversationType ||  '',
        audio: '',
        file_metadata: {},
        locked: 0,
        agenda: [""],
        abstract: '',
        owner: metadata.owner,
        sharedWith: metadata.sharedWith,
        highlights: [],
        keywords: [],
        speakers: [],
        text: [],
        created: dateTime,
        last_update: dateTime

    }
    try {
        jsonTranscript = JSON.parse(transcript)
        if (jsonTranscript === undefined || jsonTranscript.text.length === 0) throw new Error('Transcription was empty')
        conversation.confidence = jsonTranscript['confidence-score']
        let spk_pos = 0
        jsonTranscript.speakers.map(spk_trans => {
            const spkFound = conversation.speakers.find(spk_conversation => spk_conversation.speaker_name === spk_trans.speaker_id)
            if (spkFound === undefined) {
                conversation.speakers.push({
                    speaker_id: uuidv4(),
                    speaker_name: spk_trans.speaker_id,
                    stime: spk_trans.start,
                    etime: spk_trans.end
                })
            }
            let spk_text = {
                speaker_id: conversation.speakers[conversation.speakers.findIndex(spk => spk.speaker_name === spk_trans.speaker_id)].speaker_id,
                pos: spk_pos++,
                turn_id: uuidv4(),
                words: []
            }

            let word_pos = 0
            spk_trans.words.map(spk_trans_word => {
                const spk_text_word = {
                    wid: uuidv4(),
                    stime: spk_trans_word.start,
                    etime: spk_trans_word.end,
                    word: spk_trans_word.word,
                    confidence: spk_trans_word.conf,
                    pos: word_pos++,
                    highlights: [],
                    keywords: []
                }
                spk_text.words.push(spk_text_word)
            })
            conversation.text.push(spk_text)
        })

        return conversation
    } catch (err) {
        throw err
    }
}

// Add file metadata to the conversation object
async function addFileMetadataToConversation(conversation, file) {
    const file_metadata = await mm.parseBuffer(file.data, { mimeType: file.mimetype })
    conversation.audio = {
        size: file.size,
        filename: file.name,
        duration: file_metadata.format.duration,
        mimetype: file.mimetype
    }
    conversation.file_metadata = {...file_metadata }
    return conversation
}

module.exports = { sttToConversation, addFileMetadataToConversation }