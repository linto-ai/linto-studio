const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx')
const { generateLineBreak} = require('../content/documentComponents.js')

function create(conversation, format = undefined) {
    let document = {}
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
        default:
            formatTitle = conversation.name
            break
    }

    document.outputFilePath = `/tmp/${conversation.name.replace(/[^a-zA-Z0-9 ]/g, "")}.docx`
    document.doc = new Document({
        creator: conversation.owner,
        title: conversation.name,
        description: conversation.description,
        sections: []
    })

    document.paragraphs = []
    if (formatTitle) {
        document.paragraphs.push(new Paragraph({
            children: [new TextRun(formatTitle)],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
        }))
    }

    document.paragraphs.push(new Paragraph({
        children: [new TextRun(conversation.name)],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
    }))

    document.paragraphs.push(generateLineBreak())

    return document
}
