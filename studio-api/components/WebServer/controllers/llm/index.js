const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:llm:index`)
const fs = require('fs')
const FormData = require('form-data')

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

async function request(query, conversation, metadata) {
    let content = await generateText(conversation, metadata)
    const tempFileName = `file_${query.format}_${conversation._id}.txt`

    return requestAPI(query, content, tempFileName)
}

async function requestAPI(query, content, fileName) {
    if (process.env.LLM_GATEWAY_SERVICES === undefined) {
        throw new Error('LLM_GATEWAY_SERVICES is not defined')
    }

    const fetch = await import('node-fetch')
    let url = process.env.LLM_GATEWAY_SERVICES + '/services/' + query.serviceName + '/generate'

    const tempFilePath = '/tmp/' + fileName
    fs.writeFileSync(tempFilePath, content)

    let formData = new FormData()
    formData.append('format', JSON.stringify({ format: query.format }))
    formData.append('file', fs.createReadStream(tempFilePath), { filename: fileName, contentType: 'text/plain' })

    let options = {
        method: 'POST',
        headers: {
            ...formData.getHeaders()
        },
        body: formData
    }
    options.formData = formData

    const response = await fetch.default(url, options)

    const result = await response.json()
    fs.unlinkSync(tempFilePath)
    return {
        message: result.message,
        full: result
    }
}

module.exports = {
    generateText,
    request
}