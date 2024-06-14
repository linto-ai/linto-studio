const processTurn = require('../content/text.js')

const generate = (conversation, metadata, format) => {
    const { doc, paragraphs, outputFilePath } = createDocx(metadata, format)

    const paragraphs_content = []

    processTurn(paragraphs_content, conversation, metadata)

    doc.addSection({
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: paragraphs,
    })
    doc.addSection(generateHeader(metadata.name))

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

    return { doc, outputFilePath }
    // return await writeFile(doc, metadata.name, outputFilePath)
}

module.exports = {
    generate
}