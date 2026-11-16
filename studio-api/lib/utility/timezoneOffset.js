// Offset in minutes of an IANA zone at the given instant, the system zone when
// the zone is absent or unknown
function timezoneOffsetMinutes(timezone, date = new Date()) {
  try {
    const name = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName").value

    if (name === "GMT") return 0
    const match = /^GMT([+-])(\d{2}):(\d{2})$/.exec(name)
    if (!match) return 0 - date.getTimezoneOffset()
    const minutes = Number(match[2]) * 60 + Number(match[3])
    return match[1] === "-" ? -minutes : minutes
  } catch {
    return 0 - date.getTimezoneOffset()
  }
}

module.exports = { timezoneOffsetMinutes }
