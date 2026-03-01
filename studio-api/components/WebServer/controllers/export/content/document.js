const debug = require("debug")(
  `linto:components:WebServer:controllers:export:content:document`,
)

const docx = require("docx")
const { AlignmentType, SectionType } = docx

const { processTurn } = require("./text.js")

const generate = (data, query, enableProcess = true) => {
  // const templateDoc = template.generate(data, query)

  if (!query.template) {
    query.template = "default"
  }
  if (!query.format) {
    query.template = "verbatim"
  }
  const document = {
    filedata: {
      creator: data.conversation.owner,
      title: data.documentTitle || data.conversation.name,
      description: data.conversation.description,
      sections: [],
    },
    locale: data.conversation.locale,
    format: query.format,
    template: query.template,
    transcription: [],
  }

  if (enableProcess) {
    const options =
      query.format === "verbatim"
        ? { alignment: AlignmentType.LEFT }
        : {}
    processTurn(document.transcription, data, options)
  }
  return document
}

module.exports = {
  generate,
}
