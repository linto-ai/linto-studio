const debug = require("debug")(
  `linto:components:WebServer:controllers:export:format:cred`,
)

const docx = require("docx")
const { SectionType } = docx

const {
  generateHeader,
  textColumn,
} = require("../content/documentComponents.js")

const generate = (docxContent, document) => {
  document.doc.addSection(generateHeader(docxContent.filedata.title))

  const columnProperties = textColumn(2, 500)
  document.doc.addSection({
    ...columnProperties,
    children: docxContent.transcription,
  })

  return document
}

const title = () => {
  return "texte pour le Compte rendu des commissions et des délégations"
}

module.exports = {
  generate,
  title,
}
