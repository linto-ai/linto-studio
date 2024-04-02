const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:llm:index`)

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
    return requestAPI(query, content)
}

async function requestAPI(query, content) {
    if (process.env.LLM_GATEWAY_SERVICES === undefined) {
        throw new Error('LLM_GATEWAY_SERVICES is not defined')
    }
    const host = process.env.LLM_GATEWAY_SERVICES

    const response = await fetch(host + '/' + query.serviceName + '/llm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            format: query.format,
            content: content
        })
    })

    const result = await response.json()
    return {
        message: result.message,
        full: result
    }
}

module.exports = {
    generateText,
    request
}