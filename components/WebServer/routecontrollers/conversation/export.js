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
    ConversationMetadataRequire,
    ConversationError
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

async function downloadConversation(req, res, next) {
    try {
        if (!req.params.conversationId) throw new ConversationIdRequire()
        if (!req.query.format) throw new ConversationMetadataRequire('format is required')

        let conversation = await model.conversations.getById(req.params.conversationId)
        if (conversation.length !== 1) throw new ConversationNotFound()

        conversation = conversation[0]
        let metadata = {}
        if (req.body.export) {
            let body_request = JSON.parse(req.body.export)

            if (body_request.filter) conversation = await prepareConversation(conversation, body_request.filter)
            if (conversation.text.length === 0) throw new ConversationError('No data to export')


            if (body_request.metadata) metadata = await prepareMetadata(conversation, body_request.metadata)
        }


        let output = ""
        if (req.query.format === 'json') {
            output = {
                metadata: metadata,
                text: conversation.text
            }
            res.setHeader('Content-Type', 'application/json')
            res.status(200).send(output)
        }

        else if (req.query.format === 'text') {
            output = jsonToPlainText(metadata, {
                color: false,
            })
            output += "\n\n"
            conversation.text.map(text => {
                if (text.stime) output += ` ${text.stime} - ${text.etime} : `
                if (metadata.speakers) output += `${text.speaker_name} : `
                output += text.segment + "\n"
            })

            res.setHeader('Content-Type', 'text/plain')
            res.status(200).send(output)
        }

        else if (req.query.format === 'docx') {
            const file = await generateDocx(conversation, metadata)
            res.setHeader('Content-Type', 'application/vnd.openxmlformats')
            res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
            res.sendFile(file.path)
        }

        else throw new ConversationMetadataRequire('Format not supported')

    } catch (err) {
        next(err)
    }
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

async function prepareMetadata(conversation, metadata) {
    let speakers = {}
    let data = {
        title: conversation.name,
        description: conversation.description
    }

    if (metadata.title === false) delete data.title
    if (metadata.description === false) data.description = conversation.description

    if (metadata.speakers !== false) {
        data.speakers = []
        conversation.speakers.map(speaker => {
            speakers[speaker.speaker_id] = speaker.speaker_name
            data.speakers.push(speaker.speaker_name)
        })
    }

    if (metadata.tags !== false || metadata.keyword !== false) {
        data.categories = {}

        let conv_tag = await model.tags.getByIdList(conversation.tags)
        for (let tag of conv_tag) {
            let category = await model.categories.getById(tag.categoryId)
            if (!category) continue

            category = category[0]
            if (category.type === TYPE.HIGHLIGHT && metadata.keyword === false) continue
            if (category.type === TYPE.CONVERSATION_METADATA && metadata.tags === false) continue

            if (!data.categories[category.name])
                data.categories[category.name] = { type: category.type, tags: [] }

            data.categories[category.name].tags.push(tag.name)
        }
    }


    let text = conversation.text.map(turn => {
        let update_turn = {
            turn_id: turn.turn_id,
            segment: turn.segment,
        }
        if (metadata.speakers !== false) {
            update_turn.speaker_id = turn.speaker_id
            update_turn.speaker_name = speakers[turn.speaker_id]
        }
        if (metadata.timestamp !== false) {
            update_turn.stime = turn.words[0].stime
            update_turn.etime = turn.words[turn.words.length - 1].etime
        }
        return update_turn
    })

    conversation.text = text

    return data
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


    if (metadata.title) {
        paragraphs.push(new Paragraph({
            text: metadata.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
        }))
    }

    paragraphs.push(generateLineBreak())
    paragraphs.push(generateHeading('Metadata'))

    if (metadata.description) {
        paragraphs.push(generateHeading('Description', HeadingLevel.HEADING_2))
        paragraphs.push(new Paragraph({ text: conversation.description }))
    }

    if (metadata.speakers) {
        paragraphs.push(generateHeading('Speaker', HeadingLevel.HEADING_2))
        conversation.speakers.map(speaker => {
            paragraphs.push(generateBulletParagraph(speaker.speaker_name, 0))
        })
    }

    if (metadata.categories) {
        paragraphs.push(generateHeading('Categories', HeadingLevel.HEADING_2))
        for (let category in metadata.categories) {
            paragraphs.push(generateBulletParagraph(category + ' - type : ' + metadata.categories[category].type, 0))
            metadata.categories[category].tags.map(tag => {
                paragraphs.push(generateBulletParagraph(tag, 1))
            })
        }
    }



    paragraphs.push(generateHeading('Conversation'))

    conversation.text.map(turn => {
        const segment = turn.segment.replace(/' /g, "'")

        let children = []
        if (turn.stime) children.push(new TextRun({ text: `(${turn.stime} s - ${turn.etime}s) : `, italics: true }))
        if (metadata.speakers) children.push(new TextRun({ text: `${turn.speaker_name} : `, bold: true }))
        children.push(new TextRun({ text: segment }))

        paragraphs.push(
            new Paragraph({
                children
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