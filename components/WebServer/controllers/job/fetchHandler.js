const debug = require('debug')('linto:components:WebServer:controller:fetchHandler')
const axios = require(`${process.cwd()}/lib/utility/axios`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { handleResult } = require(`${process.cwd()}/components/WebServer/controllers/job/resultHandler`)

async function fetchJob(conv_id, conv_job) {
    try {
        let job_queue = Object.keys(conv_job)
            .filter(key =>
                // if job has no result_id but has job_id
                !conv_job[key]?.result_id &&
                conv_job[key]?.job_id &&
                conv_job[key]?.state !== 'error'
            ).map(key => ({
                endpoint: conv_job[key].endpoint,
                job_id: conv_job[key].job_id,
                type: key
            }))

        if (job_queue.length === 0) return

        job_queue = await Promise.all(job_queue.map(async job => {
            try {
                const host = `${process.env.GATEWAY_SERVICES}/${job.endpoint}`
                const job_info = await axios.get(`${host}/job/${job.job_id}`)
                const job_logs = await axios.get(`${host}/job-log/${job.job_id}`)

                if (job_info.state === 'done' && job_info.result_id) {
                    await fetchResult(conv_id, { ...job, ...job_info })
                }
                return {
                    ...job,
                    ...job_info, // job_info can update job previous state, that's why it's after
                    job_logs
                }
            }
            catch (err) {
                return {
                    ...job,
                    state: 'error',
                    job_logs: err.message
                }
            }
        }))

        await updateJobConversation(conv_id, conv_job, job_queue)
    } catch (err) {
        debug(`Error during job update : ${err}`)
    }
}

async function fetchResult(conv_id, job) {
    try {
        const conversation = await model.conversations.getById(conv_id)

        const result = await getResult(job, conversation[0].metadata)
        if (job.state === 'done' && job.result_id) {
            await handleResult(result, job, conversation[0])
        }
    } catch (err) {
        debug(`Error while handling result: ${err}`)
        throw err
    }
}


async function getResult(job, metadata) {
    try {
        let url = `${process.env.GATEWAY_SERVICES}/${job.endpoint}/results/${job.result_id}`
        if (metadata.transcription.transcriptionConfig.enableNormalization)
            url += '?convert_numbers=true'

        const options = { headers: { accept: 'application/json' } }

        return await axios.get(url, options)

    } catch (err) {
        debug(`Error while fetching result: ${err}`)
        throw err
    }
}

async function updateJobConversation(conv_id, conv_job, job_queue) {
    job_queue.map(job => {
        conv_job[job.type] = {
            ...conv_job[job.type],
            ...job
        }
        delete conv_job[job.type].type
    })

    await model.conversations.updateJob(conv_id, conv_job)
}

module.exports = { fetchJob }