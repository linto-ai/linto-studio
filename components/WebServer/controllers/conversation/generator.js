const debug = require('debug')('linto:components:WebServer:controller:generator')

const { v4: uuidv4 } = require('uuid');
const mm = require('music-metadata')


//Parse the stt transcription to for conversation mongodb model


function initConversation(metadata, userId, job_id) {
    let sharedWithUsers = []
    if (metadata.sharedWithUsers) {
        sharedWithUsers = metadata.sharedWithUsers
    }

    return {
        name: metadata.name,
        description: metadata.description,
        conversationType: metadata.conversationType || '',
        audio: {},
        file_metadata: {},
        locked: 0,
        agenda: [""],
        abstract: '',
        owner: userId,
        sharedWithUsers: sharedWithUsers,
        organization: {
            organizationId: metadata.organizationId,
            membersRight: metadata.membersRight,
            customRights: []
        },
        highlights: [],
        keywords: [],
        speakers: [],
        text: [],
        job: {
            job_id: job_id,
            state: 'pending',
            steps: {}
        }
    }
}

function sttToConversation(transcript, conversation) {
    try {
        jsonTranscript = transcript

        if (transcript === undefined || transcript.transcription_result.length === 0)
            throw new Error('Transcription is empty')
        conversation.confidence = transcript.confidence

        transcript.segments.map(segment => {
            /* Check and init speaker */
            let speaker = conversation.speakers.filter(speaker => speaker.speaker_name === segment.spk_id)
            if (speaker.length === 0) { // Add speaker if not found
                speaker = {
                    speaker_id: uuidv4(),
                    speaker_name: segment.spk_id,
                    stime: segment.start,
                    etime: segment.end
                }
                conversation.speakers.push(speaker)
            } else speaker = speaker[0]

            const text_segment = {
                speaker_id: speaker.speaker_id,
                turn_id: uuidv4(),
                raw_segment: segment.raw_segment,
                segment: segment.segment,
                words: []
            }

            segment.words.map(word => {
                text_segment.words.push({
                    wid: uuidv4(),
                    stime: word.start,
                    etime: word.end,
                    word: word.word,
                    confidence: word.conf,
                    highlights: [],
                    keywords: []
                })
            })
            conversation.text.push(text_segment)
        })
        return conversation
    } catch (err) {
        throw err
    }
}

// Add file metadata to the conversation object
async function addFileMetadataToConversation(conversation, file, filepath) {
    const file_metadata = await mm.parseBuffer(file.data, { mimeType: file.mimetype })
    delete file_metadata.native
    conversation.audio = {
        size: file.size,
        filename: file.name,
        duration: file_metadata.format.duration,
        mimetype: file.mimetype,
        filepath: filepath
    }

    conversation.file_metadata = {...file_metadata }
    return conversation
}

module.exports = { sttToConversation, addFileMetadataToConversation, initConversation }