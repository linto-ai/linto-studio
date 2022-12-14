const debug = require('debug')('linto:conversation-manager:components:WebServer:routecontrollers:keyword')

const conversationModel = require(`${process.cwd()}/lib/mongodb/models/conversations`)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const { createJobInterval } = require(`${process.cwd()}/components/WebServer/controllers/jobsHandler`)


const {
  KeywordError,
  KeywordUnsupportedMediaType
} = require(`${process.cwd()}/components/WebServer/error/exception/keyword`)

const {
  ConversationIdRequire,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)


async function keywordExtract(req, res, next) {
  try {
    if (!req.body.method) throw new KeywordUnsupportedMediaType('Method is required')
    if (process.env.NLP_METHOD.split(',').indexOf(req.body.method) === -1) throw new KeywordUnsupportedMediaType('Method is not supported')

    if (!req.params.conversationId) throw new ConversationIdRequire()
    const conversation = await conversationModel.getConvoById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()


    let text = ""
    if (!conversation[0].text) throw new KeywordError('Conversation has no text')
    conversation[0].text.map(segText => {
      text += segText.segment + ""
    })
    const options = {
      headers: { accept: 'application/json' },
      data: {
        nlpConfig: {
          keywordExtractionConfig: {
            enableKeywordExtraction: true,
            keywordExtractionParameters: { method: req.body.method }
          }
        },
        text: text
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
