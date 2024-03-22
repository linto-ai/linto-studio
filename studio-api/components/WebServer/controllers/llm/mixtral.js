const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:llm:mixtral`)

const DEFAULT_PROMPT = {
    en: {
        resume: 'Please summarize the following text: \n'
    },
    fr: {
        resume: 'Veuillez résumer le texte suivant: \n'
    }
}

async function getTextFromConv(conversation, metadata) {
    let prompt = ''
    let prompt_array = []

    conversation.text.map(turn => {
        if (metadata.speakers) { prompt += turn.speaker_name + ' : ' } //debug(turn.speaker_name)

        if (conversation.text.indexOf(turn) === conversation.text.length - 1) {
            prompt += turn.segment
            prompt_array.push(turn.segment)
            return
        } else {
            prompt += turn.segment + '\n'
            prompt_array.push(turn.segment)
        }
    })
    return prompt
}

async function request(query, conversation, metadata) {
    query.format = 'resume' // TODO: we support only the resumt

    let prompt = generatePrompt(query, conversation.locale)
    if (query.format === 'resume') {
        return resume(conversation, metadata, prompt)
    }
}

function generatePrompt(query, lang) {
    if (query.prompt) return query.prompt + ' \n'

    let prompt = lang.includes('fr') ? DEFAULT_PROMPT.fr : DEFAULT_PROMPT.en
    if (query.format === 'resume') {
        if (lang === 'fr') return prompt.resume
        else return prompt.resume
    }
    return DEFAULT_PROMPT.en.resume
}

async function resume(conversation, metadata, prompt) {
    let conversation_prompt = await getTextFromConv(conversation, metadata)
    // let request_prompt = prompt + conversation_prompt

    const data = {
        model: "TheBloke/Instruct_Mixtral-8x7B-v0.1_Dolly15K-AWQ",
        prompt: prompt,
        messages: [
            { role: "user", content: conversation_prompt }
        ]
    }

    if (process.env.MIXTRAL_API_HOST === undefined) {
        throw new Error('MIXTRAL_API_HOST is not defined')
    }
    const response = await fetch(process.env.MIXTRAL_API_HOST, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const result = await response.json()
    return {
        message: result.choices[0]?.message?.content,
        full: result
    }
}

module.exports = {
    request
}