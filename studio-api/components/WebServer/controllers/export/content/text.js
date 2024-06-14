const docx = require("docx")
const { createTextRun } = require('./documentComponents.js')
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
    Bookmark, SectionType, Header, Footer, PageNumber, TabStopType } = docx

function processTurnOld(paragraphs_content, conversation, metadata) {
    const lines = conversation.data.split('\n')

    //TODO: WIP to clean
    // metadata.speakers = metadata.speakers.map(speaker => speaker.charAt(0).toUpperCase() + speaker.slice(1))
    metadata.speakers = metadata.speakers.flatMap(speaker => [
        speaker, speaker.charAt(0).toUpperCase() + speaker.slice(1),
        speaker.replace(' :', ':'), (speaker.charAt(0).toUpperCase() + speaker.slice(1)).replace(' :', ':')
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

function processTurn(paragraphs_content, data) {
    const conversation = data.text
    const lines = conversation.data.split('\n')

    //TODO: WIP to clean
    // metadata.speakers = metadata.speakers.map(speaker => speaker.charAt(0).toUpperCase() + speaker.slice(1))
    data.speakers = data.speakers.flatMap(speaker => [
        speaker, speaker.charAt(0).toUpperCase() + speaker.slice(1),
        speaker.replace(' :', ':'), (speaker.charAt(0).toUpperCase() + speaker.slice(1)).replace(' :', ':')
    ])


    let last_spk = ''
    lines.map(turn => {
        let children = []

        if (turn.startsWith("- ")) {
            turn = turn.substring(2)
        } else if (turn.startsWith(" - ")) {
            turn = turn.substring(3)
        }

        if (data.speakers.length === 0) {
            children.push(new TextRun(turn))
        } else {
            // const phrasePattern = new RegExp(`\\b(${metadata.speakers.join('|')})\\b`, 'ig')
            const phrasePattern = new RegExp(`(${data.speakers.join('|')})`, 'ig')
            const segments = turn.split(phrasePattern)

            for (const segment of segments) {
                if (segments.length === 1)  // No speaker name found
                    children.push(new TextRun('\t' + segment))
                else if (data.speakers.some((phrase) => segment.includes(phrase))) {
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

module.exports = {
    processTurn,
}
