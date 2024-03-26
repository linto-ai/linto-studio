const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:llm:openai`)

const OpenAI = require('openai')
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
})

const MODEL = 'gpt-4'
const DEFAULT_PROMPT = {
    en: {
        resume: 'Please summarize the following text: \n'
    },
    fr: {
        resume: 'Veuillez résumer le texte suivant: \n'
    }
}

async function request(query, conversation, metadata) {
    query.format = 'resume' // TODO: we support only the resumt

    let prompt = generatePrompt(query, conversation.locale)
    if (query.format === 'resume') {
        return resume(conversation, metadata, prompt.resume)
    }
}

function generatePrompt(query, lang) {
    if (query.prompt) return query.prompt + ' \n'

    return lang.includes('fr') ? DEFAULT_PROMPT.fr : DEFAULT_PROMPT.en
}

async function resume(conversation, metadata, lang_prompt) {
    let prompt = await getTextFromConv(conversation, metadata)
    let request_prompt = lang_prompt + prompt
    // the max token need to be an integer
    let request = {
        model: MODEL,
        messages: [{ role: 'user', content: request_prompt }],
    }
    const chatCompletion = await openai.chat.completions.create(request)
    return {
        message: chatCompletion.choices[0]?.message?.content,
        full: chatCompletion // TODO: for debug purpose
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

module.exports = {
    request
}