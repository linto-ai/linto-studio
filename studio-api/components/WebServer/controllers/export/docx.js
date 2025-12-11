const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:controllers:export:docx`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const fs = require("fs")

const libre = require("libreoffice-convert")
const docx = require("docx")
const { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx

const { generate } = require("./generator")

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

/**
 * Generate DOCX from markdown content
 * Simple markdown to DOCX conversion for custom content export
 * @param {string} markdownContent - The markdown content
 * @param {string} fileName - The output file name (without extension)
 * @returns {Promise<{path: string, name: string}>} File info
 */
async function generateDocxFromMarkdown(markdownContent, fileName = "export") {
  const paragraphs = []
  const lines = markdownContent.split("\n")

  for (const line of lines) {
    // Handle headers
    if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3,
        })
      )
    } else if (line.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
        })
      )
    } else if (line.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
        })
      )
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      // Handle bullet points
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(line.substring(2))],
          bullet: { level: 0 },
        })
      )
    } else if (line.trim() === "") {
      // Empty line
      paragraphs.push(new Paragraph({}))
    } else {
      // Regular text - handle bold/italic
      const children = parseMarkdownInline(line)
      paragraphs.push(
        new Paragraph({
          children,
          alignment: AlignmentType.JUSTIFIED,
        })
      )
    }
  }

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9 ]/g, "")
  const outputFilePath = `/tmp/${sanitizedName}_${Date.now()}.docx`
  fs.writeFileSync(outputFilePath, buffer)

  return {
    path: outputFilePath,
    name: sanitizedName + ".docx",
  }
}

/**
 * Parse inline markdown (bold, italic) to TextRun array
 */
function parseMarkdownInline(text) {
  const children = []
  // Simple regex for **bold** and *italic* patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)

  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Bold
      children.push(
        new TextRun({
          text: part.slice(2, -2),
          bold: true,
        })
      )
    } else if (part.startsWith("*") && part.endsWith("*")) {
      // Italic
      children.push(
        new TextRun({
          text: part.slice(1, -1),
          italics: true,
        })
      )
    } else if (part) {
      children.push(new TextRun(part))
    }
  }

  return children.length > 0 ? children : [new TextRun(text)]
}

module.exports = {
  generateDocxOnFormat,
  convertToPDF,
  generateDocxFromMarkdown,
}
