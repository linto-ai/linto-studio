const debug = require("debug")(
  `linto:components:WebServer:controllers:export:format:verbatim`,
)

const docx = require("docx")
const { SectionType, Header, Paragraph, AlignmentType, Footer, PageNumber, TextRun } = docx

const generate = (docxContent, document) => {
  document.doc.addSection({
    properties: {
      type: SectionType.CONTINUOUS,
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            text: docxContent.filedata.title,
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                children: [PageNumber.CURRENT],
              }),
            ],
          }),
        ],
      }),
    },
    children: docxContent.transcription,
  })

  return document
}

const title = (title) => {
  return title
}

module.exports = {
  generate,
  title,
}
