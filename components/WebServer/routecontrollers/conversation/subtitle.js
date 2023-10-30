const debug = require('debug')(`linto:conversation-manager:components:WebServer:routeControllers:categories`)

const model = require(`${process.cwd()}/lib/mongodb/models`)

const PUNCTUATION_REGEX = /[,.!?]/
const COMPOSE_WORD_REGEX = /['-]/

const {
  ConversationUnsupportedMediaType,
} = require(`${process.cwd()}/components/WebServer/error/exception/conversation`)

const MAX_CHAR_PER_SEGMENT = 80
const MIN_CHAR_PER_SEGMENT = 20

function splitSubtitles(conv, query) {
  let segmentCharSize = MAX_CHAR_PER_SEGMENT
  if (query.segmentCharSize) segmentCharSize = parseInt(query.segmentCharSize)

  if(segmentCharSize <= MIN_CHAR_PER_SEGMENT)
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

          subtitle.push({ text: splited_segment, stime, etime: new_words[new_words.length - 1].etime, turn_id: conv_seg.turn_id })
          segment = lastwords.reverse().join(" ")

          stime = words[0] ? words[0].stime : conv_seg.words[i].stime

          // force cut on punctuation mark if segment reaches maxCharsPerSegment / 2
        }
        if (segment.length >= segmentCharSize / 2 && PUNCTUATION_REGEX.test(word)) {
          subtitle.push({ text: segment.trim(), stime, etime, turn_id: conv_seg.turn_id })
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
        subtitle.push({ text: segment.trim(), stime, etime, turn_id: conv_seg.turn_id })
        segment = " "
      }
    }

    if (segment.length > 0) subtitle.push({ text: segment.trim(), stime, etime, turn_id: conv_seg.turn_id })
  })

  return {
    segmentCharSize,
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
    srt += subtitle.text + '\n\n'
  })
  return srt
}

async function generateSubtitle(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationUnsupportedMediaType('Conversation id is required')
    const conversationId = req.params.conversationId
    const conversation = await model.conversations.getById(conversationId)

    let subtitles = splitSubtitles(conversation[0], req.query)
    if (req.query.type === 'srt') {
      const srt = generateSrt(subtitles.subtitle)
      res.status(200).send(srt)
    } else {
      res.status(200).json(subtitles)
    }
  } catch (err) {
    next(err)
  }
}



module.exports = {
  generateSubtitle,
}
