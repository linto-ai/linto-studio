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

// Shallow-merge two optional translation maps into a fresh object
// (non-object inputs are treated as empty).
function unionTranslations(a, b) {
  return {
    ...(a && typeof a === "object" ? a : {}),
    ...(b && typeof b === "object" ? b : {}),
  }
}

// Dual-recognizer sessions (e.g. speaker detection + translation) can emit
// two closedCaptions lines for the same segmentId: one carrying the locutor
// and text, another carrying the translations but no locutor. Collapse those
// into a single line so the downstream translation merge (find by segmentId)
// is deterministic and processChannelCaptions never produces duplicate turns.
// Lines without a segmentId (e.g. bot markers) are left untouched.
//
// The root cause is fixed upstream in emeeting's Transcriber (the secondary
// recognizer's canonical line is dropped at the source); this stays as a
// defensive backstop against producer/version skew, legacy recordings and
// other providers that may still emit a separate translation-only line.
function dedupeClosedCaptionsBySegmentId(closedCaptions = []) {
  const keptBySegmentId = new Map() // segmentId -> the kept line, also held in result
  const result = []

  for (const cc of closedCaptions) {
    if (cc.segmentId === undefined || cc.segmentId === null) {
      // No segmentId (bot markers, etc.) — keep as-is, never merge.
      result.push(cc)
      continue
    }

    const existing = keptBySegmentId.get(cc.segmentId)
    if (!existing) {
      // First line for this segmentId: clone so we never mutate the input.
      const clone = { ...cc }
      if (cc.translations && typeof cc.translations === "object")
        clone.translations = { ...cc.translations }
      keptBySegmentId.set(cc.segmentId, clone)
      result.push(clone)
      continue
    }

    // `existing` is the same reference stored in both the Map and `result`, so
    // mutating it in place updates the kept line everywhere. Collect the union
    // first, before adopting cc's fields can overwrite existing.translations.
    const translations = unionTranslations(
      existing.translations,
      cc.translations,
    )
    // Prefer the line that carries a locutor (and its text/timing).
    if (!existing.locutor && cc.locutor) Object.assign(existing, cc)
    if (Object.keys(translations).length > 0)
      existing.translations = translations
  }

  return result
}

function createTurn(
  channel_caption,
  spk_id,
  main,
  diarization = false,
  caption,
) {
  try {
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
  let maxEnd = 0
  let isFirst = true
  channel.closedCaptions.forEach((segment) => {
    if (segment.locutor === "bot" && segment.aend) {
      // Anchor next flux on previous flux's last caption end.
      // bot.astart/aend wall-clock overshoots the recorded audio.
      offset = maxEnd
      isFirst = false
      return
    }
    // Push a copy: segment is shared across canonical + translation passes.
    let shifted = segment
    if (offset > 0) {
      shifted = {
        ...segment,
        start: Number((segment.start + offset).toFixed(2)),
        end: Number((segment.end + offset).toFixed(2)),
      }
    } else if (isFirst && segment.start === 0) {
      // Leading turn must not start at 0; post-bot start=0 stays untouched.
      shifted = { ...segment, start: 0.01 }
    }
    isFirst = false
    if (shifted.end > maxEnd) maxEnd = shifted.end
    closedCaptions.push(shifted)
  })

  for (const channel_caption of closedCaptions) {
    const spk_id = ensureSpeaker(caption, channel_caption)
    const turn = createTurn(
      channel_caption,
      spk_id,
      main,
      channel.diarization,
      caption,
    )
    if (!turn) continue
    caption.text.push(turn)
  }
}

module.exports = {
  processChannelCaptions,
  ensureSpeaker,
  createTurn,
  dedupeClosedCaptionsBySegmentId,
}
