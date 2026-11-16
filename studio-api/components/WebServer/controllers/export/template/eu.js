const debug = require("debug")(
  `linto:components:WebServer:controllers:export:template:eu`,
)

const docx = require("docx")
const { PatchType, patchDocument, TextRun } = docx
const fs = require("fs")
const path = require("path")
const moment = require("moment")
const { timezoneOffsetMinutes } = require(
  `${process.cwd()}/lib/utility/timezoneOffset`,
)

const DATE_FORMAT = "DD MMMM YYYY HH:mm"

const content = require("../content/document.js")
const { processTurnTable } = require("../content/text.js")
const model = require(`${process.cwd()}/lib/mongodb/models`)

const generate = async (data, query) => {
  let docContent = content.generate(data, query, query.format !== "verbatim")

  if (query.format === "verbatim") {
    //we need to generate a table
    const conversation = await model.conversations.getById(data.conversationId)
    processTurnTable(docContent.transcription, conversation[0], data, query)
  }
  const templatePath = path.join(
    __dirname,
    "eu-template-session-transcription.docx",
  )
  return new Promise((resolve, _) => {
    // Offset at export time, not at the conversation time, as before
    const offsetMinutes = timezoneOffsetMinutes(query.timezone)

    let startTime = data.conversation.created
    if (data.conversation?.metadata?.channel?.channel_start_time) {
      startTime = data.conversation.metadata.channel.channel_start_time
    }

    // Falls back to now when the start date is missing or invalid
    let dateToFormat = moment(startTime, moment.ISO_8601)
    if (!dateToFormat.isValid()) {
      dateToFormat = moment()
    }
    // Adjust the date by the timezone offset
    const formattedDate = dateToFormat
      .add(offsetMinutes, "minutes")
      .format(DATE_FORMAT)

    if (Array.isArray(docContent.locale)) {
      docContent.locale = docContent.locale.join()
    }

    patchDocument(fs.readFileSync(templatePath), {
      patches: {
        title: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: query.title || "Automatic transcription",
              bold: false,
            }),
          ],
        },
        session_name: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun(docContent.filedata.title),
            // new TextRun(' - '),
            // new TextRun(channel.name),
          ],
        },
        datetime: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: formattedDate,
              bold: false,
            }),
          ],
        },
        langue: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text:
                docContent.locale !== "*" ? docContent.locale : "multilingue",
              bold: false,
            }),
          ],
        },
        transcriptions: {
          type: PatchType.DOCUMENT,
          children: docContent.transcription,
        },
      },
    }).then((doc) => {
      resolve(Buffer.from(doc))
      // resolve(new Blob([doc], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }))
    })
  })
}

module.exports = {
  generate,
}
