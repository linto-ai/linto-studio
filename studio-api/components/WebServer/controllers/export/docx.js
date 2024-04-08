const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:export:docx`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const fs = require("fs")

const libre = require('libreoffice-convert')
const docx = require("docx")
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
    Bookmark, SectionType, Header, Footer, PageNumber, TabStopType } = docx


async function generateDocxOnFormat(format, conversationExport, metadata) {
    let conversation = await model.conversations.getById(conversationExport.convId, ['speakers', 'name', 'description', 'owner'])
    metadata = {
        ...conversation[0],
        speakers: conversation[0].speakers.map(speaker => speaker.speaker_name + ' : ') //TODO: see with llm output
    }

    if (format === 'cri' || format === 'verbatim') { // comptes rendus intégraux
        return await generateCriDocx(conversationExport, metadata, format)
    }
    else if (format === 'cra') { // comptes rendus analytiques 
        return await generateCraDocx(conversationExport, metadata)
    }
    else if (format === 'cred') {
        return await generateCredDocx(conversationExport, metadata)
    }
    else {
        throw new Error('Format not supported')
    }
}


async function writeFile(doc, name, outputFilePath) {
    const buffer = await Packer.toBuffer(doc)
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

async function generateDocx(conversation, text) {
    const { doc, paragraphs, outputFilePath } = createDocx(conversation)

    paragraphs.push(generateHeading('Resume'))
    paragraphs.push(
        new Paragraph({
            children: [new TextRun(text.message)],
            alignment: AlignmentType.JUSTIFIED
        })
    )

    doc.addSection({
        properties: {},
        children: paragraphs,
    })


}


async function generateCriDocx(conversation, metadata, format) {
    const { doc, paragraphs, outputFilePath } = createDocx(metadata, format)

    const paragraphs_content = []

    processTurn(paragraphs_content, conversation, metadata)

    doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: paragraphs,
    })
    doc.addSection(generateHeaderCri(metadata.name))

    doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
            column: {
                count: 2,
                space: 720,
                separate: true,
                equalWidth: true,
            },
        },
        children: paragraphs_content,
    })
    return await writeFile(doc, metadata.name, outputFilePath)
}

async function generateCraDocx(conversation, metadata) {
    const { doc, paragraphs, outputFilePath } = createDocx(metadata, 'cra')

    const paragraphs_content = []

    processTurn(paragraphs_content, conversation, metadata)

    doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: paragraphs,
    })
    doc.addSection(generateFooter())

    doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
            column: {
                count: 2,
                space: 500,
                separate: false,
                equalWidth: true,
            },
        },
        children: paragraphs_content
    })
    return await writeFile(doc, metadata.name, outputFilePath)
}

async function generateCredDocx(conversation, metadata) {
    const { doc, paragraphs, outputFilePath } = createDocx(metadata, 'cred')

    const paragraphs_content = []

    processTurn(paragraphs_content, conversation, metadata)

    doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: paragraphs,
    })
    doc.addSection(generateHeaderCri(metadata.name))

    doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
            column: {
                count: 2,
                space: 500,
                separate: false,
                equalWidth: true,
            },
        },
        children: paragraphs_content,
    })
    return await writeFile(doc, metadata.name, outputFilePath)
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

function createDocx(conversation, format = undefined) {
    let formatTitle = undefined
    switch (format) {
        case 'cri':
            formatTitle = 'texte pour le Compte Rendu Intégral - '
            break
        case 'cra':
            formatTitle = 'texte pour le Compte Rendu Analytique  - '
            break
        case 'cred':
            formatTitle = 'texte pour le Compte rendu des commissions et des délégations  - '
            break
    }

    const outputFilePath = `/tmp/${conversation.name.replace(/[^a-zA-Z0-9 ]/g, "")}.docx`
    const doc = new Document({
        creator: conversation.owner,
        title: conversation.name,
        description: conversation.description,
        sections: []
    })

    const paragraphs = []
    if (formatTitle) {
        paragraphs.push(new Paragraph({
            children: [new TextRun(formatTitle)],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
        }))
    }

    paragraphs.push(new Paragraph({
        children: [new TextRun(conversation.name)],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
    }))

    paragraphs.push(generateLineBreak())

    return { doc, paragraphs, outputFilePath }
}

function processTurn(paragraphs_content, conversation, metadata) {
    const lines = conversation.data.message.split('\n')

    //TODO: WIP to clean
    // metadata.speakers = metadata.speakers.map(speaker => speaker.charAt(0).toUpperCase() + speaker.slice(1))
    metadata.speakers = metadata.speakers.flatMap(speaker => [
        speaker, speaker.charAt(0).toUpperCase() + speaker.slice(1)
    ])

    let last_spk = ''
    lines.map(turn => {
        let children = []

        if (turn.startsWith("- ")) {
            turn = turn.substring(2)
        } else if (turn.startsWith(" - ")) {
            turn = turn.substring(3)
        }

        if (metadata.speakers.length === 0) {
            children.push(new TextRun(turn))
        } else {
            // const phrasePattern = new RegExp(`\\b(${metadata.speakers.join('|')})\\b`, 'ig')
            const phrasePattern = new RegExp(`(${metadata.speakers.join('|')})`, 'ig')
            const segments = turn.split(phrasePattern)

            for (const segment of segments) {
                if (segments.length === 1)  // No speaker name found
                    children.push(new TextRun('\t' + segment))
                else if (metadata.speakers.some((phrase) => segment.includes(phrase))) {
                    if (last_spk !== segment) {
                        children.push(createTextRun('\t' + segment, true))
                        last_spk = segment
                    } else {
                        children.push(createTextRun('\t'))
                    }
                } else
                    children.push(new TextRun(segment))
            }
        }

        paragraphs_content.push(
            new Paragraph({
                tabStops: [
                    {
                        type: TabStopType.LEFT,
                        position: 300,
                    },
                ],
                children,
                rightToLeft: true,
                alignment: AlignmentType.JUSTIFIED,

            })
        )
        paragraphs_content.push(new Paragraph({}))
    })

    return paragraphs_content
}

function generateHeaderCri(name) {
    return {
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        text: name,
                        alignment: AlignmentType.CENTER,
                    })
                ]
            })
        },
        children: [],
    }
}

function generateHeaderCra() {
    let date = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateString = date.toLocaleDateString('fr-FR', options);

    return {
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Compte rendu analytique officiel',
                            }),
                            new TextRun({
                                text: ' '.repeat(30) + 'Sénat' + ' '.repeat(41),
                                bold: true,
                            }),
                            new TextRun({
                                text: dateString,
                            }),
                        ],
                    })
                ],
            }),
        },
        children: [],
    }
}
function generateFooter() {
    return {
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        thematicBreak: true,
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                children: [PageNumber.CURRENT],
                            }),
                        ],
                    })
                ],
            }),
        },
        children: [],
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
                    new TextRun({ text: text, color: "000000" }),
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

function createTextRun(text, bold = false) {
    return new TextRun({
        text,
        bold
    })
}

function createHighlightedTextRun(text) {
    return new TextRun({
        text,
        highlight: 'yellow',
    })
}


module.exports = {
    generateDocx,
    generateTranscriptionDocx,
    generateDocxOnFormat,
    convertToPDF
}