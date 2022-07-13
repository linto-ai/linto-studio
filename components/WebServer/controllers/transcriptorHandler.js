const debug = require('debug')('linto:components:WebServer:controller:transcriptorHandler')
const axios = require(`${process.cwd()}/lib/utility/axios`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

const ConvoModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)


const DEFAULT_INTERVAL_TIMER = 1000 // 10 sec

async function getTranscriptionResult(conversation) {
    const result_id = conversation.job.result_id

    let url = `${conversation.metadata.transcription.host}/results/${result_id}`
    const options = {
        headers: {
            accept: 'application/json'
        }
    }
    if (process.env.STT_RESULT_CONVERT_NUMBERS === 'true' || process.env.STT_RESULT_RETURN_RAW === 'true') {
        url += `?`
        if (process.env.STT_RESULT_CONVERT_NUMBERS === 'true')
            url += `convert_numbers=${process.env.STT_RESULT_CONVERT_NUMBERS}&`
        if (process.env.STT_RESULT_RETURN_RAW === 'true')
            url += `return_raw=${process.env.STT_RESULT_RETURN_RAW}&`
    }

    const result = await axios.get(url, options)
    if (result) {
        const normalizeTranscription = segmentNormalizeText(result, conversation.locale)

        conversation = SttWrapper.sttToConversation(normalizeTranscription, conversation)
        ConvoModel.update(conversation)
    }
}

async function createJobInterval(conversation) {
    const job_id = conversation.job.job_id
    const conv_id = conversation._id

    let interval = setInterval(async function () {
        try {
            const job = await axios.get(`${conversation.metadata.transcription.host}/job/${job_id}`)

            conversation.job = {
                ...job,
                job_id: job_id
            }

            if (job.state === 'done' && job.result_id) { //triger last request
                debug('job done')
                ConvoModel.updateJob(conv_id, conversation.job)
                getTranscriptionResult(conversation)
                clearInterval(interval)
            } else {
                ConvoModel.updateJob(conv_id, conversation.job)
            }

        } catch (err) {
            conversation.job = {
                job_id: job_id,
                state: 'error',
                err: err.message
            }
            ConvoModel.updateJob(conv_id, conversation.job)
            clearInterval(interval)
            debug('Jobs error', err)
        }
    }, DEFAULT_INTERVAL_TIMER)
}

module.exports = { createJobInterval }