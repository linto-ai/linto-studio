const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:conversation`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const fs = require("fs")
const docx = require("docx")
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Bookmark } = docx

const { jsonToPlainText } = require('json-to-plain-text')

const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)

const {
    ConversationIdRequire,
    ConversationNotFound,
    ConversationMetadataRequire
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function downloadConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.query.format) throw new ConversationMetadataRequire('format is required')

        let conversation = await model.conversations.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        conversation = conversation[0]

        let metadata = {}
        metadata = await prepateData(conversation, metadata, req.query.format)
        if (req.body) {
            if (req.body.filter) conversation = await prepareConversation(conversation, req.body.filter)
            if (conversation.text.length === 0) res.status(204).send()

            if (req.body.metadata) metadata = await prepareMetadata(conversation, req.body.metadata, metadata)
        }

        switch (req.query.format) {
            case 'json':
                await handleJsonFormat(res, metadata, conversation);
                break;
            case 'text':
                await handleTextFormat(res, metadata, conversation);
                break;
            case 'docx':
            case 'verbatim':
                await handleDocxFormat(res, conversation, metadata);
                break;
            case 'crt':
                break;
            default:
                await handleFormat(res, req.query.format, conversation, metadata);

            // throw new ConversationMetadataRequire('Format not supported')
        }

    } catch (err) {
        next(err)
    }
}

async function handleFormat(res, format, conversation, metadata) {
    //we check if the format and conversationId exist in the collection conversationExport
    let conversationExport = await model.conversationExport.getByConvAndFormat(conversation._id, format)
    if (conversationExport.length === 0) {
        let conversationExport = {
            convId: conversation._id.toString(),
            format: format,
            status: "pending"
        }
        exportResult = await model.conversationExport.create(conversationExport)
        conversationExport._id = exportResult.insertedId.toString()
        //make an asyncrone timer of two minute then update that export to done
        setTimeout(async () => {
            conversationExport.status = "done"
            //Give me a small json to add in data
            conversationExport.data = { title: false, description: false, speakers: false, tags: false, keyword: false }
            await model.conversationExport.update(conversationExport)
            debug('done')
        }, 5000)

    } else {
        //do we regenerate a new one if user ask, check if status is pending
        if (conversationExport[0].status === "pending") {
            //we regenerate the file
        } else {
            conversationExport = conversationExport[0]

        }
    }

    res.status(200).send('ok')

}

async function handleJsonFormat(res, metadata, conversation) {
    let output = {
        metadata: metadata,
        text: conversation.text
    }

    //we don't add metadata if json is empty
    if (Object.keys(metadata).length === 0) delete output.metadata

    debug(metadata)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(output)
}

async function handleTextFormat(res, metadata, conversation) {
    let output = jsonToPlainText(metadata, {
        color: false,
    })
    output += "\n\n"
    conversation.text.map(text => {
        if (metadata.speakers) output += `${text.speaker_name} : `
        if (text.stime) output += `${text.stime} - ${text.etime} : `
        output += text.segment + "\n\n"
    })

    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(output)
}

async function handleDocxFormat(res, conversation, metadata) {
    const file = await generateDocx(conversation, metadata)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats')
    res.setHeader('Content-disposition', 'attachment; filename=' + file.name)
    res.sendFile(file.path)
}

async function prepareConversation(conversation, filter) {
    if (filter.speaker)
        conversation.text = conversation.text.filter(turn => filter.speaker.includes(turn.speaker_id))

    if (filter.keyword) {
        keyword_list = filter.keyword.split(',')
        keyword_list = (await model.tags.getByIdList(keyword_list)).map(tag => tag.name)
        conversation.text = conversation.text.filter(turn => keyword_list.some((keyword) => turn.segment.toLowerCase().includes(keyword)))
    }
    return conversation
}

async function prepateData(conversation, data, format) {
    data.title = conversation.name
    if (conversation.description)
        data.description = conversation.description

    let speakers = {}

    data.speakers = []
    conversation.speakers.map(speaker => {
        speakers[speaker.speaker_id] = speaker.speaker_name
        data.speakers.push(speaker.speaker_name)
    })

    let secondsDecimals = 2
    if (format === 'docx') secondsDecimals = 0

    let text = conversation.text.map(turn => {
        let update_turn = {
            turn_id: turn.turn_id,
            segment: turn.segment,
        }
        update_turn.speaker_id = turn.speaker_id
        update_turn.speaker_name = speakers[turn.speaker_id]
        update_turn.stime = secondsToHHMMSSWithDecimals(turn.words[0].stime, secondsDecimals)
        update_turn.etime = secondsToHHMMSSWithDecimals(turn.words[turn.words.length - 1].etime, secondsDecimals)
        return update_turn
    })

    conversation.text = text
    return data
}

async function prepareMetadata(conversation, metadata, data) {

    if (metadata.tags !== false || metadata.keyword !== false) {
        data.categories = {}

        let conv_tag = await model.tags.getByIdList(conversation.tags)
        for (let tag of conv_tag) {
            let category = await model.categories.getById(tag.categoryId)
            if (!category) continue

            category = category[0]
            if (category.type === TYPE.HIGHLIGHT && metadata.keyword === false) continue
            if (category.type === TYPE.LABEL && metadata.tags === false) continue

            if (!data.categories[category.name])
                data.categories[category.name] = { type: category.type, tags: [] }

            data.categories[category.name].tags.push(tag.name)
        }
        if (Object.keys(data.categories).length === 0) delete data.categories
    }


    return data
}

async function generateDocx(conversation, metadata, show = {}) {
    conversation.name = conversation.name.replace(/[^a-zA-Z0-9 ]/g, "")

    const outputFilePath = `/tmp/${conversation.name}.docx`
    const doc = new Document({
        creator: conversation.owner,
        title: conversation.name,
        description: conversation.description,
        sections: []
    })

    const paragraphs = []

    paragraphs.push(new Paragraph({
        text: metadata.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
    }))

    paragraphs.push(generateLineBreak())

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


function createHighlightedTextRun(text) {
    return new TextRun({
        text,
        highlight: 'yellow',
    })
}

function secondsToHHMMSSWithDecimals(totalSeconds, secondsDecimals = 0) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = (totalSeconds % 60).toFixed(secondsDecimals)

    if (hours === 0) return `${minutes.toString().padStart(2, '0')}:${seconds}`
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds}`
}


module.exports = {
    downloadConversation,
}