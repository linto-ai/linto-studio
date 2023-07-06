const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:keyword')

const model = require(`${process.cwd()}/lib/mongodb/models`)

const axios = require(`${process.cwd()}/lib/utility/axios`)

const { createJobInterval } = require(`${process.cwd()}/components/WebServer/controllers/jobsHandler`)

const {
  KeywordError,
  KeywordUnsupportedMediaType
} = require(`${process.cwd()}/components/WebServer/error/exception/keyword`)

const {
  ConversationIdRequire,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const MAX_WORD = 100

async function keywordExtract(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()


    if (!conversation[0].text) throw new KeywordError('Conversation has no text')

    let documents = []
    let text = ""
    let nb_word = 0
    conversation[0].text.map(segText => {
      segText.segment.split(/\s+/).map(seg => {
        text += seg + " "
        nb_word++
        if (nb_word > MAX_WORD) {
          documents.push(text)
          text = ""
          nb_word = 0
        }
      })
    })
    if (text !== "") documents.push(text)

    const options = {
      headers: { accept: 'application/json' },
      data: {
        nlpConfig: {
          keywordExtractionConfig: {
            enableKeywordExtraction: true,
            serviceName: 'nlp-keyword-extraction',

            method: 'keybert',
            methodConfig: { top_n : 1, diversity : 0.8 }
          }
        },
        documents: documents
      }
    }

    const job = await axios.post(`${process.env.NLP_SERVICES}/nlp`, options)
    let jobs = {
      type: 'keyword',
      job_id: job.jobid,
      filter: {}
    }

    createJobInterval(process.env.NLP_SERVICES, conversation[0], jobs)

    res.status(201).send({
      message: 'A keyword job is currently being processed'
    })
  } catch (err) {
    next(err)
  }
}


module.exports = {
  keywordExtract,
}
