const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:export:docx:template:eu`)

const docx = require("docx")
const {
    PatchType,
    patchDocument,
    Table,
    TableCell,
    TableRow,
    WidthType,
    TableLayoutType,
} = docx
const fs = require('fs')
const path = require('path')
const { format, parseISO, addSeconds } = require('date-fns')
const { en } = require('date-fns/locale')
const { DateTime } = require('luxon')

const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx')
const { generateLineBreak } = require('../content/documentComponents.js')

const templatePath = path.join(__dirname, 'eu-template-session-transcription.docx')
const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const DATE_FORMAT = 'dd MMMM yyyy HH:mm'

const generate = async (docContent, data, query) => {
    const templatePath = path.join(__dirname, 'eu-template-session-transcription.docx')
    return new Promise((resolve, _) => {
        // we need to use DateTime.now to take into account summer/winter time
        const TZ = query.timezone || systemTimezone
        const offsetMinutes = DateTime.now().setZone(TZ).offset;

        // Parse data.created or create a new date if it's invalid or undefined
        let dateToFormat = DateTime.fromISO(data.created || '', { zone: 'local' })
        if (!dateToFormat.isValid) {
            dateToFormat = DateTime.now()
        }
        // Adjust the date by the timezone offset
        const adjustedDate = dateToFormat.plus({ minutes: offsetMinutes })
        const formattedDate = adjustedDate.toFormat(DATE_FORMAT)

        if (Array.isArray(docContent.locale)) {
            docContent.locale = docContent.locale.join()
        }
        patchDocument(fs.readFileSync(templatePath), {
            patches: {
                session_name: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun(docContent.filedata.title),
                        // new TextRun(' - '),
                        // new TextRun(channel.name),
                        new TextRun(` (${docContent.locale})`)
                    ],
                },
                datetime: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun({
                            text: formattedDate,
                            bold: true,
                        }),
                    ],
                },
                transcriptions: {
                    type: PatchType.DOCUMENT,
                    children: docContent.transcription,
                }
            },
        }).then(doc => {
            resolve(new Blob([doc], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }))
        })
    })
}

module.exports = {
    generate
}