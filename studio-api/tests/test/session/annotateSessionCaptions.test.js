jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
  () => ({ authFailLimiter: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
  () => ({}),
)

const { annotateSessionCaptions } = require(
  `${process.cwd()}/components/WebServer/controllers/session/session.js`,
)

describe("annotateSessionCaptions", () => {
  it("flags the captions of every channel of a session", async () => {
    const session = {
      id: "s1",
      channels: [
        {
          closedCaptions: [
            { segmentId: 1, locutor: "Guest-1" },
            { segmentId: 2, locutor: "Alice" },
            { segmentId: 3, locutor: null },
          ],
          translatedCaptions: [{ segmentId: 1, locutor: "spk_0" }],
        },
        { closedCaptions: null, translatedCaptions: null },
      ],
    }
    const result = JSON.parse(
      await annotateSessionCaptions(JSON.stringify(session)),
    )
    const [first, second] = result.channels
    expect(first.closedCaptions.map((c) => c.locutorDefined)).toEqual([
      false,
      true,
      undefined,
    ])
    expect(first.translatedCaptions[0].locutorDefined).toBe(false)
    expect(second).toEqual({ closedCaptions: null, translatedCaptions: null })
  })

  it("flags a single channel whose translations are keyed by segmentId", async () => {
    const channel = {
      closedCaptions: [{ segmentId: 1, locutor: "Bob" }],
      translatedCaptions: {
        1: [{ segmentId: 1, targetLang: "en", locutor: "Guest-2" }],
      },
    }
    const result = JSON.parse(
      await annotateSessionCaptions(JSON.stringify(channel)),
    )
    expect(result.closedCaptions[0].locutorDefined).toBe(true)
    expect(result.translatedCaptions["1"][0].locutorDefined).toBe(false)
  })

  it("returns the payload unchanged when nothing carries a locutor", async () => {
    const payload = JSON.stringify({ channels: [{ closedCaptions: [] }] })
    expect(await annotateSessionCaptions(payload)).toBe(payload)
    expect(await annotateSessionCaptions("not json")).toBe("not json")
  })
})
