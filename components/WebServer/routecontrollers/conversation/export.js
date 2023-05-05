const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const fs = require("fs")
const docx = require("docx")
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Bookmark } = docx

const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationMetadataRequire,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function downloadConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.query.format) throw new ConversationMetadataRequire('format is required')

        const conversation = await model.conversations.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        let output = ""
        if (req.query.format === 'json') {
            output = conversation[0].text
            res.status(200).send(output)
        }

        else if (req.query.format === 'text') {
            if (!conversation[0].text) throw new ConversationError('Conversation has no text')
            conversation[0].text.map(text => {
                output += text.segment + ""
            })
            res.status(200).send(output)
        }

        else if (req.query.format === 'docx') {
            const file = await generateDocx(conversation[0], req.query.metadata)
            res.setHeader('Content-Type', 'application/vnd.openxmlformats')
            res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
            res.sendFile(file.path)
        }

        else throw new ConversationMetadataRequire('Format not supported')

    } catch (err) {
        next(err)
    }
}

async function generateDocx(conversation, metadata) {
    const outputFilePath = `/tmp/${conversation.name}.docx`;
    const doc = new Document({
        creator: conversation.owner,
        title: conversation.name,
        description: conversation.description,
        sections: []
    })

    const paragraphs = []

    paragraphs.push(new Paragraph({
        text: conversation.name,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
    }))

    paragraphs.push(generateHeading('Conversation'))

    conversation.text.map(turn => {
        const segment = turn.segment.replace(/' /g, "'")
        const speakerName = conversation.speakers.find(speaker => speaker.speaker_id === turn.speaker_id).speaker_name
        const timestamp = `(${Math.trunc(turn.words[0].stime)} s - ${Math.trunc(turn.words[turn.words.length - 1].etime)}s) `

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: timestamp, italics: true }),
                    new TextRun({ text: speakerName, bold: true }),
                    new TextRun({ text: ` : ${segment}` })
                ],
            })
        )
        paragraphs.push(new Paragraph({}))
    })

    if (metadata === 'true') {
        paragraphs.push(generateLineBreak())
        paragraphs.push(generateHeading('Metadata'))

        if (conversation.description) {
            paragraphs.push(generateHeading('Description', HeadingLevel.HEADING_2))
            paragraphs.push(new Paragraph({ text: conversation.description }))
        }

        paragraphs.push(generateHeading('Speaker', HeadingLevel.HEADING_2))
        conversation.speakers.map(speaker => {
            paragraphs.push(generateBulletParagraph(speaker.speaker_name, 0))
        })

        paragraphs.push(generateHeading('Transcription', HeadingLevel.HEADING_2))
        paragraphs.push(generateBulletParagraph(`lang : ${conversation.locale}`, 0))
        paragraphs.push(generateBulletParagraph(`result_id : ${conversation.jobs.transcription.result_id}`, 0))
        paragraphs.push(generateBulletParagraph(`transcriptionConfig : ${JSON.stringify(conversation.metadata.transcription.transcriptionConfig)}`, 0))

    }

    const section = {
        properties: {},
        children: paragraphs,
    }
    doc.addSection(section)

    const buffer = await Packer.toBuffer(doc)
    fs.writeFileSync(outputFilePath, buffer)
    return {
        path: outputFilePath,
        name: conversation.name + '.docx'
    }
}

function generateLineBreak() {
    return new Paragraph({
        thematicBreak: true,
    })
}

function generateHeading(text, headingLevel = HeadingLevel.HEADING_1, alignement = AlignmentType.LEFT) {

    return new Paragraph({
        heading: headingLevel,
        alignment: alignement,
        children: [
            new Bookmark({
                children: [
                    new TextRun(text),
                ]
            })
        ]
    })
}

function generateBulletParagraph(text, level) {
    return new Paragraph({
        text: text,
        bullet: {
            level
        },
    })
}

module.exports = {
    downloadConversation,
}