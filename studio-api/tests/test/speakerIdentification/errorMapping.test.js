jest.mock("debug", () => () => () => {})

const { StudioError } = require(
  `${process.cwd()}/components/WebServer/error/exception/base`,
)
const {
  VoiceSampleError,
  VoiceSampleNotFound,
  VoiceSampleUnsupportedMediaType,
  SpeakerLabelConflict,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)
const handler = require(`${process.cwd()}/components/WebServer/error/handler`)
const { validateAudioFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

// Capture the express error middleware registered by handler.init().
function buildHandler() {
  let middleware
  handler.init({ express: { use: (fn) => (middleware = fn) } })
  return middleware
}

function mockRes() {
  const res = {}
  res.statusCode = null
  res.body = null
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (body) => {
    res.body = body
    return res
  }
  res.send = (body) => {
    res.body = body
    return res
  }
  return res
}

describe("speaker identification error mapping", () => {
  test("typed exceptions extend StudioError and carry their declared status", () => {
    expect(new VoiceSampleUnsupportedMediaType()).toBeInstanceOf(StudioError)
    expect(new VoiceSampleUnsupportedMediaType().status).toBe(415)
    expect(new VoiceSampleError().status).toBe(400)
    expect(new VoiceSampleNotFound().status).toBe(404)
    expect(new SpeakerLabelConflict().status).toBe(409)
  })

  test("the global error handler maps a typed speaker error to its status, not 500", () => {
    const middleware = buildHandler()
    const res = mockRes()

    middleware(
      new VoiceSampleUnsupportedMediaType(
        "Unsupported audio format: audio/x-m4a",
      ),
      {},
      res,
      () => {},
    )

    expect(res.statusCode).toBe(415)
    expect(res.body).toEqual({
      message: "Unsupported audio format: audio/x-m4a",
    })
  })

  test("a non-StudioError still falls back to 500", () => {
    const middleware = buildHandler()
    const res = mockRes()

    middleware(new Error("boom"), {}, res, () => {})

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ message: "boom" })
  })
})

describe("voice sample audio validation", () => {
  const sample = (mimetype) => ({ mimetype, size: 1024, name: "voice.m4a" })

  test.each(["audio/mp4", "audio/x-m4a", "audio/m4a", "audio/aac"])(
    "accepts m4a/aac mimetype %s",
    (mimetype) => {
      expect(() =>
        validateAudioFile(
          sample(mimetype),
          VoiceSampleUnsupportedMediaType,
          VoiceSampleError,
        ),
      ).not.toThrow()
    },
  )

  test("rejects an unknown mimetype with a 415 StudioError", () => {
    let thrown
    try {
      validateAudioFile(
        sample("application/octet-stream"),
        VoiceSampleUnsupportedMediaType,
        VoiceSampleError,
      )
    } catch (err) {
      thrown = err
    }
    expect(thrown).toBeInstanceOf(StudioError)
    expect(thrown.status).toBe(415)
  })
})
