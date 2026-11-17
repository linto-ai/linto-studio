const saas = require(`${process.cwd()}/lib/saas`)
const { computeFeatures } = require(`${process.cwd()}/lib/features`)

const ENV_KEYS = ["SESSION_API_ENDPOINT", "ENABLE_SPEAKER_IDENTIFICATION"]

describe("computeFeatures", () => {
  const savedEnv = {}

  beforeEach(() => {
    ENV_KEYS.forEach((key) => (savedEnv[key] = process.env[key]))
    process.env.SESSION_API_ENDPOINT = ""
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "false"
  })

  afterEach(() => {
    ENV_KEYS.forEach((key) => {
      if (savedEnv[key] === undefined) delete process.env[key]
      else process.env[key] = savedEnv[key]
    })
    saas.register(null)
  })

  it("announces nothing on a plain open-source deployment", () => {
    expect(computeFeatures({})).toEqual({
      saas: false,
      session: false,
      speakerIdentification: false,
    })
  })

  it("announces SaaS once CloudService handed its plugin over", () => {
    saas.register({})
    expect(computeFeatures({}).saas).toBe(true)
  })

  it("announces sessions only with both the session API and the broker", () => {
    process.env.SESSION_API_ENDPOINT = "http://session-api"
    expect(computeFeatures({}).session).toBe(false)
    expect(computeFeatures({ BrokerClient: {} }).session).toBe(true)

    process.env.SESSION_API_ENDPOINT = ""
    expect(computeFeatures({ BrokerClient: {} }).session).toBe(false)
  })

  it("announces speaker identification when its switch is on", () => {
    process.env.ENABLE_SPEAKER_IDENTIFICATION = "true"
    expect(computeFeatures({}).speakerIdentification).toBe(true)
  })
})
