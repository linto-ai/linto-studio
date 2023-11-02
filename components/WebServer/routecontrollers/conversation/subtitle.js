const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:subtitle`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const PUNCTUATION_REGEX = /[,.!?]/
const COMPOSE_WORD_REGEX = /['-]/

const {
  ConversationUnsupportedMediaType,
  ConversationNotFound
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const MAX_CHAR_PER_SEGMENT = 80
const MIN_CHAR_PER_SEGMENT = 20

function splitSubtitles(conv, query) {
  let segmentCharSize = MAX_CHAR_PER_SEGMENT
  if (query.segmentCharSize) segmentCharSize = parseInt(query.segmentCharSize)

  if (segmentCharSize <= MIN_CHAR_PER_SEGMENT)
    segmentCharSize = MIN_CHAR_PER_SEGMENT

  const segmentMaxSize = segmentCharSize + 20
  const subtitle = []
  let words = []
  let stime, etime

  let segment = ""

  conv.text.map(conv_seg => {
    for (let i = 0; i < conv_seg.words.length; i++) {
      const word = conv_seg.words[i].word

      if (segment === "" || segment === " ") { // On new subtitle segment
        stime = conv_seg.words[i].stime
        words = []
      }

      words.push(conv_seg.words[i])
      segment += word + " "
      etime = conv_seg.words[i].etime

      // on punctuation mark, split the segment if it's too long
      if (PUNCTUATION_REGEX.test(word)) {
        let lastwords = []
        if (segment.length >= segmentCharSize) {
          const word_segment = segment.split(" ")

          while (segment.length >= segmentCharSize) {
            lastwords.push(word_segment.pop())
            segment = word_segment.join(" ").trim()
          }

          const splited_segment = word_segment.join(" ").trim()
          const new_words = words.splice(0, splited_segment.split(' ').length)

          subtitle.push({ text: [splited_segment], stime, etime: new_words[new_words.length - 1].etime, turn_id: conv_seg.turn_id })
          segment = lastwords.reverse().join(" ")

          stime = words[0] ? words[0].stime : conv_seg.words[i].stime

          // force cut on punctuation mark if segment reaches maxCharsPerSegment / 2
        }
        if (segment.length >= segmentCharSize / 2 && PUNCTUATION_REGEX.test(word)) {
          subtitle.push({ text: [segment.trim()], stime, etime, turn_id: conv_seg.turn_id })
          segment = " " // Allow to add the last segment 
        }
      }

      if (segment.length > segmentMaxSize) {
        // Should not stop on composed word, will add the next word
        if (COMPOSE_WORD_REGEX.test(conv_seg.words[i].word)) {
          i++
          segment += conv_seg.words[i].word + " "
          etime = conv_seg.words[i].etime
        }
        subtitle.push({ text: [segment.trim()], stime, etime, turn_id: conv_seg.turn_id })
        segment = " "
      }
    }

    if (segment.length > 0) subtitle.push({ text: [segment.trim()], stime, etime, turn_id: conv_seg.turn_id })
  })


  let numberOfLines = 1
  if (query.numberOfLines !== undefined) {
    numberOfLines = parseInt(query.numberOfLines)

    if (!isNaN(numberOfLines) && numberOfLines > 1) {
      subtitle.map(subtitle => {
        subtitle.text = splitStringIntoLines(subtitle.text[0], numberOfLines)
      })
    }
  }

  return {
    generate_settings: {
      segmentCharSize,
      numberOfLines,
    },
    subtitle
  }
}

function secondsToSRT(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = (seconds % 3600) % 60
  const milliseconds = Math.round((remainingSeconds - Math.floor(remainingSeconds)) * 1000)

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.floor(remainingSeconds)).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`

  return formattedTime
}

function generateSrt(subtitle_data) {
  let srt = ''
  let srt_index = 1
  subtitle_data.map(subtitle => {
    srt += srt_index++ + '\n'
    srt += secondsToSRT(subtitle.stime) + ' --> ' + secondsToSRT(subtitle.etime) + '\n'
    srt += subtitle.text.join('\n') + '\n\n'
  })
  return srt
}

function splitStringIntoLines(inputString, numberOfLines) {
  const words = inputString.split(/[\s]+/) // Split the string at spaces, periods, commas, semicolons, exclamation marks, and question marks.
  const lineCount = Math.min(numberOfLines, words.length); // Ensure numberOfLines is not greater than the number of words.
  const wordsPerLine = Math.ceil(words.length / lineCount)
  const lines = []

  for (let i = 0; i < lineCount; i++) {
    const startIndex = i * wordsPerLine
    const endIndex = startIndex + wordsPerLine
    const line = words.slice(startIndex, endIndex).join(' ')
    lines.push(line)
  }

  // Do we want the string or the array ??
  // return lines.join('\n')
  return lines
}

async function generateSubtitle(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    const conversationId = req.params.conversationId

    const conversation = await model.conversations.getById(conversationId)
    const conv_subtitle = await model.conversationSubtitles.getById(conversationId)

    if (conversation.length !== 1) throw new ConversationNotFound()
    let conv = conversation[0]

    let subtitles = splitSubtitles(conversation[0], req.query)
    subtitles = {
      ...subtitles,
      _id: conv._id,  // Make sur to use the conversation id
      name: conv.name,
      description: conv.description,
      owner: conv.owner,
      metadata: conv.metadata
    }

    if (conv_subtitle.length > 0) await model.conversationSubtitles.update(subtitles)
    else await model.conversationSubtitles.create(subtitles)

    if (req.query.type === 'srt') {
      const srt = generateSrt(subtitles.subtitle)
      res.status(200).send(srt)
    } else res.status(200).json(subtitles)

  } catch (err) {
    next(err)
  }
}

async function getSubtitle(req, res, next) {
  try {
    const conversationId = req.params.conversationId
    const conv_subtitle = await model.conversationSubtitles.getById(conversationId)

    if (conv_subtitle.length === 0) { // If no subtitle exist, we generate it the first time
      await generateSubtitle(req, res, next)
    } else {
      if (req.query.type === 'srt') {
        const srt = generateSrt(conv_subtitle[0].subtitle)
        res.status(200).send(srt)
      } else {
        res.status(200).json(conv_subtitle[0])
      }
    }
  } catch (err) {
    next(err)
  }
}



module.exports = {
  generateSubtitle,
  getSubtitle
}
