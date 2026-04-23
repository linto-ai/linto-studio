const { v4: uuidv4 } = require("uuid")

const TYPES = require(`${process.cwd()}/lib/dao/conversation/types`)

const DEFAULT_SPEAKER_NAME = "Unknown speaker"
const DEFAULT_TRANSLATION_NAME = "Automatic Translation"

function ensureSpeaker(caption, channel_caption) {
  let speakerName
  if (caption.type.mode === TYPES.TRANSLATION)
    speakerName = DEFAULT_TRANSLATION_NAME
  else if (channel_caption.locutor) speakerName = channel_caption.locutor
  else speakerName = DEFAULT_SPEAKER_NAME

  let existingSpeaker = caption.speakers.find(
    (speaker) => speaker.speaker_name === speakerName,
  )

  if (!existingSpeaker) {
    const newSpeaker = {
      speaker_id: uuidv4(),
      speaker_name: speakerName,
      stime: channel_caption.start,
      etime: channel_caption.end,
    }
    caption.speakers.push(newSpeaker)
    return newSpeaker.speaker_id
  }

  return existingSpeaker.speaker_id
}

function createTurn(
  channel_caption,
  spk_id,
  main,
  diarization = false,
  caption,
) {
  try {
    if (main && diarization && !channel_caption.locutor) {
      return
    }

    let turn = {
      speaker_id: spk_id,
      turn_id: uuidv4(),
      raw_segment: channel_caption.text,
      segment: channel_caption.text,
      stime: channel_caption.start,
      etime: channel_caption.end,
      lang: channel_caption.lang,
      words: [],
    }

    if (
      caption.type.mode === TYPES.TRANSLATION &&
      channel_caption?.translations[caption.locale]
    ) {
      turn.segment = channel_caption.translations[caption.locale]
      turn.raw_segment = channel_caption.translations[caption.locale]
    } else if (
      caption.type.mode === TYPES.TRANSLATION &&
      !channel_caption?.translations[caption.locale]
    ) {
      return
    }

    if (turn.raw_segment !== undefined) {
      turn.raw_segment.split(" ").forEach((word) => {
        turn.words.push({
          wid: uuidv4(),
          word: word,
        })
      })
    }

    return turn
  } catch (err) {
    return null
  }
}

function processChannelCaptions(channel, caption, main = true) {
  let closedCaptions = []
  let offset = 0
  channel.closedCaptions.forEach((segment) => {
    if (segment.locutor === "bot" && segment.aend) {
      // Calculate duration and add it to offset when caption was cut off
      const startDate = new Date(segment.astart)
      const endDate = new Date(segment.aend)
      const durationSeconds = (endDate - startDate) / 1000
      offset += durationSeconds
    } else {
      // Adjust timing for non-bot segments on multiple captions
      if (offset > 0) {
        segment.start = Number((segment.start + offset).toFixed(2))
        segment.end = Number((segment.end + offset).toFixed(2))
      }
      closedCaptions.push(segment) // Only push non-bot segments
    }
  })

  let prevSegmentWithTimestamps = undefined

  for (const channel_caption of closedCaptions) {
    let spk_id = ensureSpeaker(caption, channel_caption)
    if (channel_caption.locutor === "bot") {
      prevSegmentWithTimestamps = channel_caption
    }
    let turn = createTurn(
      channel_caption,
      spk_id,
      main,
      channel.diarization,
      caption,
      prevSegmentWithTimestamps,
    )
    if (!turn) continue
    caption.text.push(turn)
  }
}

module.exports = {
  processChannelCaptions,
  ensureSpeaker,
  createTurn,
}
