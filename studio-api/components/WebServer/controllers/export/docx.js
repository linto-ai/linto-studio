const debug = require("debug")(
  `linto:components:WebServer:controllers:export:docx`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const fs = require("fs")

const libre = require("libreoffice-convert")
const docx = require("docx")
const { Packer } = docx

const { generate } = require("./generator")

async function generateVerbatimDocx(query, conversation, metadata) {
  const {
    Document,
    Paragraph,
    TextRun,
    AlignmentType,
    Header,
    Footer,
    PageNumber,
    BorderStyle,
  } = docx

  const title = metadata.title || conversation.name || ""
  const conversationLocale = conversation.locale

  function langDisplayName(langCode) {
    if (!langCode) return null
    if (langCode === "*") return null
    try {
      const name = new Intl.DisplayNames(["fr"], { type: "language" }).of(langCode)
      return name.charAt(0).toUpperCase() + name.slice(1)
    } catch {
      return langCode
    }
  }

  const children = []

  // Title
  children.push(
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 28 })],
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
    }),
  )
  // Separator
  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
      },
      spacing: { after: 240 },
    }),
  )

  let lastSpeaker = null

  for (const turn of conversation.text) {
    const speakerChanged = turn.speaker_name !== lastSpeaker

    if (speakerChanged) {
      const headerParts = [
        new TextRun({ text: turn.speaker_name, bold: true, size: 24 }),
      ]

      const metaParts = []
      if (turn.stime) metaParts.push(turn.stime)
      const lang = turn.lang || conversationLocale
      const langName = langDisplayName(lang)
      if (langName) metaParts.push(langName)

      if (metaParts.length > 0) {
        headerParts.push(
          new TextRun({
            text: " \u00B7 " + metaParts.join(" \u00B7 "),
            size: 18,
            color: "999999",
          }),
        )
      }

      children.push(
        new Paragraph({
          children: headerParts,
          spacing: { before: 240 },
        }),
      )

      lastSpeaker = turn.speaker_name
    }

    // Segment text
    children.push(
      new Paragraph({
        children: [new TextRun({ text: turn.segment, size: 22 })],
        alignment: AlignmentType.LEFT,
        spacing: { after: 60 },
      }),
    )
  }

  const doc = new Document({
    creator: "LinTO Studio",
    title: title,
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: title, size: 16, color: "999999" }),
                ],
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
                    size: 16,
                    color: "999999",
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  })

  return await writeFile(doc, title)
}

async function generateDocxOnFormat(query, conversationExport) {
  let conversation = await model.conversations.getById(
    conversationExport.convId,
    ["speakers", "name", "description", "owner", "locale", "metadata"],
  )
  const data = {
    conversation: conversation[0],
    speakers: conversation[0].speakers.map(
      (speaker) => speaker.speaker_name + " : ",
    ),
    text: conversationExport,
    conversationId: conversationExport.convId,
  }

  let document = await generate(data, query)
  if (document instanceof Buffer)
    return await writeBuffer(document, data.conversation.name)

  return await writeFile(document.doc, data.conversation.name)
}

async function writeFile(doc, name) {
  const buffer = await Packer.toBuffer(doc)
  const outputFilePath = `/tmp/${name.replace(/[^a-zA-Z0-9 ]/g, "")}.docx`
  fs.writeFileSync(outputFilePath, buffer)

  return {
    path: outputFilePath,
    name: name + ".docx",
  }
}

async function writeBuffer(buffer, name) {
  const outputFilePath = `/tmp/${name.replace(/[^a-zA-Z0-9 ]/g, "")}.docx`

  fs.writeFileSync(outputFilePath, buffer)
  return {
    path: outputFilePath,
    name: name + ".docx",
  }
}

async function writeBlobToFile(blob, name) {
  const arrayBuffer = await blob.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Create output file path and sanitize the file name
  const outputFilePath = `/tmp/${name.replace(/[^a-zA-Z0-9 ]/g, "")}.docx`

  // Write the Buffer to a file
  fs.writeFileSync(outputFilePath, buffer)

  return {
    path: outputFilePath,
    name: name + ".docx",
  }
}
async function convertToPDF(file) {
  const enterData = fs.readFileSync(file.path)

  // Convert it to .pdf format
  const result = await new Promise((resolve, reject) => {
    libre.convert(enterData, ".pdf", undefined, (err, done) => {
      if (err) {
        reject(err)
      } else {
        resolve(done)
      }
    })
  })

  // Write the .pdf file
  const outputFilePath = `/tmp/${file.name.replace(/[^a-zA-Z0-9 ]/g, "")}.pdf`
  fs.writeFileSync(outputFilePath, result)

  // Return the path and name of the .pdf file
  return {
    path: outputFilePath,
    name: `${file.name}.pdf`,
  }
}

module.exports = {
  generateDocxOnFormat,
  generateVerbatimDocx,
  convertToPDF,
}
