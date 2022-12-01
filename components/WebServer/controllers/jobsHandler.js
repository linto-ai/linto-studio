const debug = require('debug')('linto:components:WebServer:controller:jobsHandler')
const axios = require(`${process.cwd()}/lib/utility/axios`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

const ConvoModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)

const DEFAULT_INTERVAL_TIMER = 1000 // 10 sec

async function getResult(host, processing_job, job, conversation) {
    try {
        let url = `${host}/results/${job.result_id}`
        if (conversation.metadata.transcription.transcriptionConfig.enableNormalization) {
            url += '?convert_numbers=true'
        }

        const options = {
            headers: {
                accept: 'application/json'
            }
        }
        const result = await axios.get(url, options)

        if (result && processing_job.type === 'transcription') {
            const normalizeTranscription = segmentNormalizeText(result, conversation.locale, processing_job.filter)
            conversation = SttWrapper.transcriptionToConversation(normalizeTranscription, conversation)
            ConvoModel.updateConvOnTranscriptionResult(conversation._id, conversation)
        } else if (result && processing_job.type === 'keyword') {
            ConvoModel.updateKeyword(conversation._id, { ...conversation.keywords, ...result })
        }

    } catch (err) {
        debug(`Error while getting transcription result: ${err}`)

        let job_status = {
            ...job,
            state: 'error',
            err: err.message
        }
        updateConversation(conversation, jobs_type, job_status)
    }
}

async function createJobInterval(host, conversation, processing_job) {
    let interval = setInterval(async function () {
        try {
            const job_info = await axios.get(`${host}/job/${processing_job.job_id}`)
            let job_status = {
                ...job_info,
                job_id: processing_job.job_id
            }

            if (job_info.state === 'done' && job_info.result_id) { //triger last request
                updateConversation(conversation, processing_job, job_info)

                getResult(host, processing_job, job_status, conversation)

                debug('jobs done')
                clearInterval(interval)
            } else {
                updateConversation(conversation, processing_job, job_status)
            }
        } catch (err) {
            let job_status = {
                job_id: processing_job.job_id,
                state: 'error',
                err: err.response.data
            }

            updateConversation(conversation, processing_job, job_status)
            clearInterval(interval)
            debug('Jobs error', err.response.data)
        }
    }, DEFAULT_INTERVAL_TIMER)
}



function updateConversation(conversation, processing_job, job_info) {
    const id = conversation._id
    if (processing_job.type === 'transcription') {
        conversation.jobs.transcription = job_info
    } else if (processing_job.type === 'keyword') {
        conversation.jobs.keyword = job_info
    }
    ConvoModel.updateJob(id, conversation.jobs)

}

module.exports = { createJobInterval }