const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:export:docx`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const fs = require("fs")

const libre = require('libreoffice-convert')
const docx = require("docx")
const { Packer, Paragraph, TextRun, HeadingLevel, AlignmentType} = docx

const { generate } = require('./generator')


async function generateDocxOnFormat(query, conversationExport, metadata) {
    let conversation = await model.conversations.getById(conversationExport.convId, ['speakers', 'name', 'description', 'owner'])
    data = {
        conversation: conversation[0],
        speakers: conversation[0].speakers.map(speaker => speaker.speaker_name + ' : '),
        text: conversationExport,

    }

    let document = generate(data, query)
    return await writeFile(document.doc, data.conversation.name)
}

async function writeFile(doc, name) {
    const buffer = await Packer.toBuffer(doc)
    const outputFilePath = `/tmp/${name.replace(/[^a-zA-Z0-9 ]/g, "")}.docx`
    fs.writeFileSync(outputFilePath, buffer)

    return {
        path: outputFilePath,
        name: name + '.docx'
    }
}
async function convertToPDF(file) {
    const enterData = fs.readFileSync(file.path)

    // Convert it to .pdf format
    const result = await new Promise((resolve, reject) => {
        libre.convert(enterData, '.pdf', undefined, (err, done) => {
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
        name: `${file.name}.pdf`
    }
}

async function generateTranscriptionDocx(conversation, metadata, show = {}) {
    const { doc, paragraphs, outputFilePath } = createDocx(conversation)

    // We don't want to show metadata if there is nothing asked to show
    if (Object.keys(show).length >= 1) paragraphs.push(generateHeading('Metadata'))

    if (show?.description) {
        paragraphs.push(generateHeading('Description', HeadingLevel.HEADING_2))
        paragraphs.push(new Paragraph({ text: conversation.description }))
    }

    if (show?.speakers) {
        if (conversation.speakers.length === 1) paragraphs.push(generateHeading('Speaker', HeadingLevel.HEADING_2))
        else paragraphs.push(generateHeading('Speakers', HeadingLevel.HEADING_2))

        conversation.speakers.map(speaker => {
            paragraphs.push(generateBulletParagraph(speaker.speaker_name, 0))
        })
    }

    if (show?.categories) {
        paragraphs.push(generateHeading('Categories', HeadingLevel.HEADING_2))
        for (let category in metadata.categories) {
            paragraphs.push(generateBulletParagraph(category + ' - type : ' + metadata.categories[category].type, 0))
            metadata.categories[category].tags.map(tag => {
                paragraphs.push(generateBulletParagraph(tag, 1))
            })
        }
    }

    let targetPhrases = []
    if (show?.categories) {
        for (let category in metadata.categories) {
            if (metadata.categories[category].type === TYPE.HIGHLIGHT) {
                metadata.categories[category].tags.map(tag => {
                    targetPhrases.push(tag)
                })
            }
        }
    }

    paragraphs.push(generateHeading('Transcription'))

    conversation.text.map(turn => {
        let children = []
        if (metadata.speakers) children.push(new TextRun({ text: `${turn.speaker_name} : `, bold: true }))
        if (turn.stime) children.push(new TextRun({ text: `(${turn.stime} s - ${turn.etime}s) : `, italics: true }))

        if (targetPhrases.length === 0) {
            children.push(new TextRun(turn.segment))
        } else {
            const phrasePattern = new RegExp(`\\b(${targetPhrases.join('|')})\\b`, 'ig')
            const segments = turn.segment.split(phrasePattern)

            for (const segment of segments) {
                if (targetPhrases.some((phrase) => segment.toLowerCase().includes(phrase.toLowerCase()))) children.push(createHighlightedTextRun(segment))
                else children.push(new TextRun(segment))
            }
        }

        paragraphs.push(
            new Paragraph({
                children,
                alignment: AlignmentType.JUSTIFIED
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

module.exports = {
    generateTranscriptionDocx,
    generateDocxOnFormat,
    convertToPDF
}
