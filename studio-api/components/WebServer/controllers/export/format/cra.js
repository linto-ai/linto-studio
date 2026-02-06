const debug = require("debug")(
  `linto:components:WebServer:controllers:export:format:cra`,
)

const docx = require("docx")
const { SectionType } = docx

const {
  generateFooter,
  textColumn,
} = require("../content/documentComponents.js")

const generate = (docxContent, document) => {
  document.doc.addSection(generateFooter())

  const columnProperties = textColumn(2, 500)
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
