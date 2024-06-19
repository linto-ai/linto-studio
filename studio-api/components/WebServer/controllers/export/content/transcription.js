const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:export:content:transcription`)

const docx = require("docx")
const { SectionType } = docx

const { processTurn } = require('./text.js')
const { generateHeader } = require('./documentComponents.js')
const template = require('../template/index.js')

const generate = (data, query) => {
    // const templateDoc = template.generate(data, query)

    if (!query.template) {
        query.template = 'default'
    }
    if (!query.format) {
        query.template = 'verbatim'
    }
    const document = {
        filedata: {
            creator: data.conversation.owner,
            title: data.documentTitle || data.conversation.name,
            description: data.conversation.description,
            sections: [],
        },
        locale: data.conversation.locale,
        format: query.format,
        template: query.template,
        transcription: []
    }

    const paragraphs_content = []
    processTurn(document.transcription, data)
    return document

    templateDoc.doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: templateDoc.paragraphs,
    })
    templateDoc.doc.addSection(generateHeader(data.conversation.name))

    const columnProperties = template.textColumn(query.template, 2, 500)
    templateDoc.doc.addSection({
        ...columnProperties,
        children: paragraphs_content,
    })

    return templateDoc
}

module.exports = {
    generate
}

