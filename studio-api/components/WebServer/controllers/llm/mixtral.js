const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:llm:mixtral`)

const DEFAULT_PROMPT = {
    en: {
        resume: 'Please summarize the following text: \n',
        cri: 'Please summarize the following text: \n',
        cra: 'Please summarize the following text: \n',
        cred: 'Please summarize the following text: \n',
    },
    fr: {
        cri: 'Veuillez résumer le texte suivant: \n',
        cra: 'Veuillez résumer le texte suivant: \n',
        cred: 'Veuillez résumer le texte suivant: \n',
        resume: `Vous êtes un chargé de mission hautement qualifié. Vous rédigez des comptes rendus de réunions et de conférences avec des interlocuteurs extérieurs strictement et seulement en français. Ces comptes-rendus ont un usage interne à la structure ou vous travaillez. Vous utilisez toujours les conventions orthographiques du français. Vous attachez de l'importance à une écriture correcte et formelle. Vous écrivez de manière concise tout en offrant une lecture agréable.
        Sur la base de transcriptions, vous rédigerez le procès-verbal en suivant ces lignes directrices :
        fournir un résumé de la transcription qui soit détaillé, complet, approfondi et complexe, tout en restant clair et concis.
        intégrer les idées principales et les informations essentielles, en éliminant les éléments superflus et en se concentrant sur les aspects critiques
        Toujours attribuer les idées et les informations essentielles au locuteur, à l'orateur ou au participant concerné. Chaque tour de parole est présenté sous une forme "spk1 :" suivi de la transcription attribuée. Ici spk1 est le nom du locuteur.
        S'appuyer strictement sur la transcription fournie en entrée sans inclure d'informations externes.
        Présenter le résumé sous forme de paragraphes pour en faciliter la compréhension. Proposer un titre.
        à la fin du compte rendu, fournir les points d'action clés ou les conclusions de la réunion ou de la conférence sous forme d'un paragraphe indépendant avec un titre adapté au contenu.
        Si elles sont présentes dans la transcription, les actions future mentionnées comme décisions ou objectifs, ainsi que les acteurs concernés par ces actions (éméteurs, déstinataire, opérateur, ressources...) feront aussi l'objet d'un paragraphe dédié.
        la transcription à traiter est fournie ci après entre trois \`.`
    }
}

async function getTextFromConv(conversation, metadata) {
    let prompt = ''
    let prompt_array = []
    let spk = {}

    conversation.text.map(turn => {
        if (metadata.speakers) {
            // we get the total number of speaker in spk array as nanem
            spk[turn.speaker_name] = Object.keys(spk).length
            prompt += (spk[turn.speaker_name] + 1) + ' : '
            // prompt += turn.speaker_name + ' : ' }
        }

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

function generatePrompt(query, lang) {
    if (query.prompt) return query.prompt + ' \n'
    return lang.includes('fr') ? DEFAULT_PROMPT.fr : DEFAULT_PROMPT.en
}


async function request(query, conversation, metadata) {
    let prompt = generatePrompt(query, conversation.locale)
    const formatFunctions = { // We map the format to the function
        'resume': resume,
        'cri': cri,
        'cra': cra,
        'cred': cred
    }

    if (formatFunctions.hasOwnProperty(query.format)) {
        return formatFunctions[query.format](conversation, metadata, prompt[query.format])
    } else {
        throw new Error('Format not supported')
    }
}

async function resume(conversation, metadata, prompt) {
    let conversation_prompt = await getTextFromConv(conversation, metadata)

    const data = {
        // model: "TheBloke/Instruct_Mixtral-8x7B-v0.1_Dolly15K-AWQ",
        model: 'TheBloke/Vigostral-7B-Chat-AWQ',
        prompt: prompt,
        messages: [{ role: "user", content: "```" + conversation_prompt + "```" }],
        // messages: [{ role: "user", content: prompt + "```" + conversation_prompt + "```" }],
    }
    return requestAPI(data)
}

async function cri(conversation, metadata, prompt) {
    let conversation_prompt = await getTextFromConv(conversation, metadata)

    const data = {
        // model: "TheBloke/Instruct_Mixtral-8x7B-v0.1_Dolly15K-AWQ",
        model: 'TheBloke/Vigostral-7B-Chat-AWQ',
        prompt: prompt,
        messages: [{ role: "user", content: "```" + conversation_prompt + "```" }],
        // messages: [{ role: "user", content: prompt + "```" + conversation_prompt + "```" }],
    }
    return requestAPI(data)
}

async function cra(conversation, metadata, prompt) {
    let conversation_prompt = await getTextFromConv(conversation, metadata)

    const data = {
        // model: "TheBloke/Instruct_Mixtral-8x7B-v0.1_Dolly15K-AWQ",
        model: 'TheBloke/Vigostral-7B-Chat-AWQ',
        prompt: prompt,
        messages: [{ role: "user", content: "```" + conversation_prompt + "```" }],
        // messages: [{ role: "user", content: prompt + "```" + conversation_prompt + "```" }],
    }
    return requestAPI(data)
}

async function cred(conversation, metadata, prompt) {
    let conversation_prompt = await getTextFromConv(conversation, metadata)

    const data = {
        // model: "TheBloke/Instruct_Mixtral-8x7B-v0.1_Dolly15K-AWQ",
        model: 'TheBloke/Vigostral-7B-Chat-AWQ',
        prompt: prompt,
        messages: [{ role: "user", content: "```" + conversation_prompt + "```" }],
        // messages: [{ role: "user", content: prompt + "```" + conversation_prompt + "```" }],
    }
    return requestAPI(data)
}


async function requestAPI(data) {
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