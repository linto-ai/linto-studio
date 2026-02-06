const debug = require("debug")(
  `linto:components:WebServer:controllers:export:format:cri`,
)

const docx = require("docx")
const { SectionType } = docx

const {
  generateHeader,
  textColumn,
} = require("../content/documentComponents.js")

const generate = (docxContent, document) => {
  document.doc.addSection(generateHeader(docxContent.filedata.title))

  const columnProperties = textColumn(2, 720)
  document.doc.addSection({
    ...columnProperties,
    children: docxContent.transcription,
  })

  return document
}

const title = () => {
  return "texte pour le Compte Rendu Analytique"
}

module.exports = {
  generate,
  title,
}
