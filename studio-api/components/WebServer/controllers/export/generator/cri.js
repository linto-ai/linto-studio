const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:export:generator:cri`)

const docx = require("docx")
const { SectionType } = docx

const { processTurn } = require('../content/text.js')
const { generateHeader } = require('../content/documentComponents.js')
const template = require('../template/index.js')

const generate = (data, query) => {
    data.documentTitle = 'texte pour le Compte Rendu Analytique  - '
    const templateDoc = template.generate(data, query.template)

    const paragraphs_content = []
    processTurn(paragraphs_content, data)

    templateDoc.doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: templateDoc.paragraphs,
    })
    templateDoc.doc.addSection(generateHeader(data.conversation.name))

    templateDoc.doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
            column: {
                count: 2,
                space: 720,
                separate: false,
                equalWidth: true,
            },
        },
        children: paragraphs_content,
    })

    return templateDoc
}

module.exports = {
    generate
}