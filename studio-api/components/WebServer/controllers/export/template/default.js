const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx')
const { generateLineBreak} = require('../content/documentComponents.js')

function create(data) {
    const documentData = {
        creator: data.conversation.owner,
        title: data.documentTitle || data.conversation.name,
        description: data.conversation.description,
        sections: []
    }

    let document = {}
    document.doc = new Document(documentData)

    document.paragraphs = []

    document.paragraphs.push(new Paragraph({
        children: [new TextRun(documentData.title)],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
    }))

    document.paragraphs.push(generateLineBreak())

    return document
}

module.exports = {
    create
}
