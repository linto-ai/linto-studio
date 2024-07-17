const { format, parseISO, addSeconds } = require("date-fns")
const { DateTime } = require("luxon")

const txtGenerator = (session, channel, timezone) => {
  return new Promise((resolve, reject) => {
    const offsetMinutes = DateTime.now().setZone(timezone).offset
    let content = `${session.name} - ${channel.name} (${channel.languages.join("_")})\n\n`
    content += channel.closed_captions
      .map((caption) => {
        const startDatetime = format(
          addSeconds(
            parseISO(caption.astart),
            caption.start + offsetMinutes * 60,
          ),
          "HH:mm:ss",
        )
        return `${startDatetime}: ${caption.text}`
      })
      .join("\n")
    resolve(new Blob([content], { type: "text/plain" }))
  })
}

module.exports = txtGenerator
