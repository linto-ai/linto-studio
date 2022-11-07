const debug = require('debug')('linto:components:WebServer:controller:jobsHandler')
const axios = require(`${process.cwd()}/lib/utility/axios`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

const ConvoModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)


const DEFAULT_INTERVAL_TIMER = 1000 // 10 sec


async function getResult(host, job, jobs_type, conversation) {
    try {
        let url = `${host}/results/${job.result_id}`
        const options = {
            headers: {
                accept: 'application/json'
            }
        }

        const result = await axios.get(url, options)

        if (result && jobs_type === 'transcription') {
            const normalizeTranscription = segmentNormalizeText(result, conversation.locale)
            conversation = SttWrapper.transcriptionToConversation(normalizeTranscription, conversation)
            ConvoModel.updateConvOnTranscriptionResult(conversation._id, conversation)
        } else if (result && jobs_type === 'keyword') {
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

async function createJobInterval(host, jobs_id, jobs_type, conversation) {
    let interval = setInterval(async function () {
        try {
            const job = await axios.get(`${host}/job/${jobs_id}`)
            let job_status = {
                ...job,
                job_id: jobs_id
            }

            if (job.state === 'done' && job.result_id) { //triger last request
                updateConversation(conversation, jobs_type, job_status)

                getResult(host, job_status, jobs_type, conversation)

                debug('jobs done')
                clearInterval(interval)
            } else {
                updateConversation(conversation, jobs_type, job_status)
            }
        } catch (err) {
            let job_status = {
                job_id: jobs_id,
                state: 'error',
                err: err.message
            }

            updateConversation(conversation, jobs_type, job_status)
            clearInterval(interval)
            debug('Jobs error', err)
        }
    }, DEFAULT_INTERVAL_TIMER)
}



function updateConversation(conversation, jobs_type, job) {
    const id = conversation._id
    if (jobs_type === 'transcription') {
        conversation.jobs.transcription = job
    } else if (jobs_type === 'keyword') {
        conversation.jobs.keyword = job
    }
    ConvoModel.updateJob(id, conversation.jobs)

}

module.exports = { createJobInterval }