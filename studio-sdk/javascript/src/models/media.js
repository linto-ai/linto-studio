import { timeToHMS } from "../tools/timeToHMS.js"

export default function mediaFactory(media) {
  return new Proxy(media, {
    get(media, prop, receiver) {
      switch (prop) {
        case "rawText":
          return media.text.reduce((text, turn) => {
            return text + turn.segment + "\n"
          }, "")
        case "turns":
          return computeTurns(media)
        case "toFormat":
          return (options) => formatMedia(media, options)
        default:
          return Reflect.get(media, prop, receiver)
      }
    },
  })
}

function computeTurns(media) {
  const indexedSpeakers = {}
  if (media.speakers) {
    media.speakers.forEach((spk) => {
      indexedSpeakers[spk.speaker_id] = spk
    })
  }

  const defaultLang = media?.locale?.[0] || "xx-xx"

  return media.text.map((turn) => {
    const firstWord = turn?.words?.[0]
    const lastWord = turn?.words?.[turn.words.length - 1]

    return {
      speaker: indexedSpeakers?.[turn.speaker_id]?.speaker_name,
      lang: turn?.lang ?? turn?.language ?? defaultLang,
      text: turn.segment,
      stime: turn?.word?.stime ?? firstWord?.stime,
      etime: turn?.word?.etime ?? lastWord?.etime,
    }
  })
}

function formatMedia(
  media,
  {
    sep = " - ",
    metaTextSep = " : ",
    eol = "CRLF",
    ensureFinalEOL = false,
    include = { speaker: true, lang: true, timestamp: true },
    order = ["speaker", "lang", "timestamp"],
  } = {}
) {
  const lines = computeTurns(media).map((turn) => {
    const parts = []
    order.forEach((item) => {
      if (item === "speaker" && include.speaker && turn.speaker)
        parts.push(turn.speaker)
      if (item === "lang" && include.lang && turn.lang) parts.push(turn.lang)
      if (item === "timestamp" && include.timestamp && turn.stime != null) {
        const stime = timeToHMS(turn.stime)
        parts.push(stime)
      }
    })
    const line = parts.join(sep) + metaTextSep + turn.text
    return line + (eol === "CRLF" ? "\r\n" : "\n")
  })

  const result = lines.join("")
  return ensureFinalEOL ? result + (eol === "CRLF" ? "\r\n" : "\n") : result
}
