const moment = require("moment")
const { timezoneOffsetMinutes } = require(
  `${process.cwd()}/lib/utility/timezoneOffset`,
)

describe("timezoneOffsetMinutes", () => {
  const summer = new Date("2026-07-01T12:00:00Z")
  const winter = new Date("2026-01-15T12:00:00Z")

  it("gives the zone offset at the given instant, summer and winter", () => {
    expect(timezoneOffsetMinutes("Europe/Paris", summer)).toBe(120)
    expect(timezoneOffsetMinutes("Europe/Paris", winter)).toBe(60)
    expect(timezoneOffsetMinutes("America/New_York", winter)).toBe(-300)
    expect(timezoneOffsetMinutes("Asia/Kolkata", summer)).toBe(330)
    expect(timezoneOffsetMinutes("UTC", summer)).toBe(0)
  })

  it("falls back to the system zone when the zone is absent or unknown", () => {
    const system = 0 - summer.getTimezoneOffset()
    expect(timezoneOffsetMinutes(undefined, summer)).toBe(system)
    expect(timezoneOffsetMinutes("", summer)).toBe(system)
    expect(timezoneOffsetMinutes("Mars/Olympus", summer)).toBe(system)
  })
})

// The export formats as produced before the switch from luxon and date-fns:
// the shifted instant rendered in the process local time, checked against Date
describe("export date formats", () => {
  const start = "2026-03-05T14:30:00.000Z"
  const offset = timezoneOffsetMinutes("Europe/Paris", new Date(start))
  const two = (n) => String(n).padStart(2, "0")

  it("turn table keeps the HH:mm clock time shifted by the zone offset", () => {
    const startMoment = moment(start, moment.ISO_8601).add(offset, "minutes")
    for (const stime of [0, 65, 3599.4, 2 * 86400 + 1]) {
      const local = new Date(Date.parse(start) + (stime + offset * 60) * 1000)
      const expected = `${two(local.getHours())}:${two(local.getMinutes())}`
      const clock = startMoment.clone().add(stime, "seconds").format("HH:mm")
      expect(clock).toBe(expected)
    }
  })

  it("eu template keeps the long date format", () => {
    const local = new Date(Date.parse(start) + offset * 60 * 1000)
    const month = local.toLocaleString("en-US", { month: "long" })
    const expected =
      `${two(local.getDate())} ${month} ${local.getFullYear()} ` +
      `${two(local.getHours())}:${two(local.getMinutes())}`
    const formatted = moment(start, moment.ISO_8601)
      .add(offset, "minutes")
      .format("DD MMMM YYYY HH:mm")
    expect(formatted).toBe(expected)
    expect(moment(undefined, moment.ISO_8601).isValid()).toBe(false)
  })
})
