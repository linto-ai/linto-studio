const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:llm:index`)
const fs = require('fs')
const FormData = require('form-data')
const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require('axios').default


async function generateText(conversation, metadata) {
    let prompt = ''

    conversation.text.map(turn => {
        if (metadata.speakers) {
            prompt += turn.speaker_name + ' : '
        }

        if (conversation.text.indexOf(turn) === conversation.text.length - 1) {
            prompt += turn.segment
            return
        } else {
            prompt += turn.segment + '\n'
        }
    })

    return prompt
}

async function request(query, conversation, metadata, conversationExport) {
    let content = await generateText(conversation, metadata)
    const tempFileName = `file_${query.format}_${conversation._id}.txt`

    return requestAPI(query, content, tempFileName, conversationExport)
}


async function requestAPI(query, content, fileName, conversationExport) {
    if (process.env.LLM_GATEWAY_SERVICES === undefined) {
        throw new Error('LLM_GATEWAY_SERVICES is not defined')
    }

    const fetch = await import('node-fetch')
    let url = process.env.LLM_GATEWAY_SERVICES + '/services/' + query.format + '/generate'

    const tempFilePath = '/tmp/' + fileName
    fs.writeFileSync(tempFilePath, content)

    let formData = new FormData()

    formData.append('flavor', query.flavor)
    formData.append('file', fs.createReadStream(tempFilePath), { filename: fileName, contentType: 'text/plain' })

    let options = {
        method: 'POST',
        headers: {
            ...formData.getHeaders()
        },
        body: formData
    }
    options.formData = formData

    let jobId = undefined
    try {
        const response = await fetch.default(url, options)
        const result = await response.json()

        jobId = result.jobId
    } catch (err) {
        jobId = undefined
        conversationExport.status = 'error'
        model.conversationExport.updateStatus(conversationExport)
    }

    fs.unlinkSync(tempFilePath)
    if (jobId !== undefined) {
        pollingLlm(jobId, conversationExport)
    }
    return jobId
}

async function pollingLlm(jobsId, conversationExport) {
    try {
        if (process.env.LLM_GATEWAY_SERVICES === undefined) {
            throw new Error('LLM_GATEWAY_SERVICES is not defined')
        }
        const options = {
            headers: {
                Accept: 'application/json'
            }
        }

        let url = process.env.LLM_GATEWAY_SERVICES + '/results/' + jobsId

        const intervalId = setInterval(async () => {
            let result = {}
            try {
                result = await axios.get(url, options)
                conversationExport.status = result.data.status
                if (result.data.status === 'complete' && result.data.message === 'success') {
                    conversationExport.data = result.data.summarization
                    conversationExport.processing = 'Processing 100%'
                    model.conversationExport.updateStatus(conversationExport)
                } else if (result.data.status === 'error') {
                    conversationExport.data = result.data.message
                    model.conversationExport.updateStatus(conversationExport)
                } else if (result.data.status === 'queued') {
                    conversationExport.processing = result.data.message
                    model.conversationExport.updateStatus(conversationExport)
                }

                if (result.data.status === 'complete' || result.data.status === 'error' || result.data.status === 'nojob') {
                    clearInterval(intervalId)
                }
            } catch (err) {
                conversationExport.status = 'error'
                if (err?.response?.data)
                    conversationExport.error = err.response.data
                model.conversationExport.updateStatus(conversationExport)
                clearInterval(intervalId)
            }
        }, 30000)

        setTimeout(() => {
            clearInterval(intervalId)
        }, 60 * 60 * 1000)

    } catch (err) {
        conversationExport.status = 'error'
        conversationExport.error = err.message
        model.conversationExport.updateStatus(conversationExport)
    }
}

module.exports = {
    generateText,
    request,
    pollingLlm
}