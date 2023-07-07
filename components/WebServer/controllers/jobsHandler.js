const debug = require('debug')('linto:components:WebServer:controller:jobsHandler')
const axios = require(`${process.cwd()}/lib/utility/axios`)

const SttWrapper = require(`${process.cwd()}/components/WebServer/controllers/conversation/generator`)
const { segmentNormalizeText } = require(`${process.cwd()}/components/WebServer/controllers/conversation/normalizeSegment`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const DEFAULT_INTERVAL_TIMER = 1000 // 10 sec

async function getResult(host, processing_job, job, conversation) {
    try {
        let url = `${host}/results/${job.result_id}`

        if (conversation.metadata.transcription.transcriptionConfig.enableNormalization) {
            url += '?convert_numbers=true'
        }

        const result = await axios.get(url, {
            headers: {
                accept: 'application/json'
            }
        })

        if (result && processing_job.type === 'transcription') {
            const normalizeTranscription = segmentNormalizeText(result, conversation.locale, processing_job.filter)

            conversation = SttWrapper.transcriptionToConversation(normalizeTranscription, conversation)
            conversation.jobs.transcription = job

            model.conversations.updateConvOnTranscriptionResult(conversation._id, conversation)
        } else if (result && processing_job.type === 'keyword') {
            conversation.jobs.nlp.keyword = job
            model.conversations.updateJob(conversation._id, conversation.jobs)

            const organizationId = conversation.organization.organizationId
            const category = await model.categories.getHighlightCategories(conversation.organization.organizationId)
            const categoryId = category[0]._id.toString()

            let tagList = conversation.tags || []
            for (let i in result.keyword_extraction) {
                const keyword = result.keyword_extraction[i]
                const key = Object.keys(keyword)[0]
                const tag = await model.tags.getByOrgaId(organizationId, { name: key })

                if (tag.length === 0 && keyword[key] > 0.5) { //if probability is higher than 0.6
                    let result = await model.tags.create({
                        name: key,
                        categoryId: categoryId,
                        organizationId: organizationId
                    })
                    tagList.push(result.insertedId.toString())
                } else if (tag.length > 0) {
                    tagList.push(tag[0]._id.toString())
                }
            }

            // remove duplicate or null value from tagList
            tagList = tagList.filter((item, index) => tagList.indexOf(item) === index && item !== null)

            await model.conversations.updateTag(conversation._id, tagList)

        }
    } catch (err) {
        debug(`Error while getting transcription result: ${err}`)
        let job_status = {
            ...job,
            state: 'error',
            err: err.message
        }

        updateJobConversation(conversation, processing_job, job_status)
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
                getResult(host, processing_job, job_status, conversation)

                clearInterval(interval)
                debug('jobs done')

            } else updateJobConversation(conversation, processing_job, job_status)  // Jobs still running

        } catch (err) {
            let job_status = {
                job_id: processing_job.job_id,
                state: 'error',
                err: err.response.data
            }

            updateJobConversation(conversation, processing_job, job_status)
            clearInterval(interval)
        }
    }, DEFAULT_INTERVAL_TIMER)
}

function updateJobConversation(conversation, processing_job, job_info) {
    const id = conversation._id

    if (processing_job.type === 'transcription') {
        conversation.jobs.transcription = job_info
    } else {
        if (conversation.jobs.nlp === undefined) conversation.jobs.nlp = {}
        if (processing_job.type === 'keyword') {
            conversation.jobs.nlp.keyword = job_info
        }
    }

    model.conversations.updateJob(id, conversation.jobs)
}

module.exports = { createJobInterval }