const debug = require('debug')('linto:components:WebServer:controller:generator')

const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const mm = require('music-metadata')

//Parse the stt transcription to for conversation mongodb model
function initConversation(metadata, userId, job_id) {
    let sharedWithUsers = []
    if (metadata.sharedWithUsers) sharedWithUsers = metadata.sharedWithUsers

    let transcriptionConfig = metadata.transcriptionConfig
    try {
        transcriptionConfig = JSON.parse(metadata.transcriptionConfig)
    } catch (err) {
        // Do nothing, already a json
    }

    return {
        name: metadata.name,
        description: metadata.description,
        locked: 0,
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
        metadata: {
            transcription: {
                ...metadata.service,
                transcriptionConfig: transcriptionConfig
            },
            audio: {},
            file: {}
        },
        locale: metadata.service.locale,
        jobs: {
            transcription: {
                job_id: job_id,
                state: 'pending',
                steps: {}
            }
        }
    }
}

function transcriptionToConversation(transcript, conversation) {
    try {
        jsonTranscript = transcript

        if (transcript === undefined || transcript.transcription_result.length === 0)
            throw new Error('Transcription was empty')
        conversation.metadata.transcription.confidence = transcript.confidence

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
                if (!speaker.speaker_name) speaker.speaker_name = 'speaker'
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
async function addFileMetadataToConversation(conversation, file) {
    const file_metadata = await mm.parseStream(fs.createReadStream(file.storageFilePath), { mimeType: 'audio/mpeg' })
    delete file_metadata.native

    conversation.metadata.audio = {
        filename: file.originalFileName,
        duration: file_metadata.format.duration,
        mimetype: 'audio/mpeg', // mp3
        filepath: file.filePath,
        originalFilepath: file.originalFilePath
    }

    conversation.metadata.file = { ...file_metadata }
    return conversation
}

module.exports = { transcriptionToConversation, addFileMetadataToConversation, initConversation }