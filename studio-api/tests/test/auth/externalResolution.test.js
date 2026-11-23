jest.mock("debug", () => () => () => {})

const mockModel = {
  externalEntitlements: { findUser: jest.fn(), findDomain: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const resolve = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)
const {
  capabilitiesFrom,
  canQuickMeeting,
  hasFeature,
  hasActiveFeature,
  hasLintoFeature,
} = require(`${process.cwd()}/lib/dao/entitlement/features`)

const ROOT = "0123456789abcdef01234567"
const OTHER_ROOT = "1111111111111111aaaaaaaa"
const LIVE_ONLY = { transcription: { live: true } }
const BOTH = { transcription: { live: true, async: true } }
const resolveFeatures = (identity) => resolve.resolveFeatures(identity, ROOT)

const userRecord = (over = {}) => ({
  _id: "u",
  kind: "user",
  organizationId: ROOT,
  provider: "external",
  email: "jdoe@collectivite.fr",
  subject: "jdoe",
  features: LIVE_ONLY,
  ...over,
})
const domainRecord = (over = {}) => ({
  _id: "d",
  kind: "domain",
  organizationId: ROOT,
  provider: "external",
  domain: "collectivite.fr",
  features: BOTH,
  ...over,
})

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.externalEntitlements.findUser.mockResolvedValue([])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
})

test("nothing recorded resolves to nothing", async () => {
  const identity = {
    provider: "meet:linagora",
    subject: "s",
    email: "nobody@nowhere.fr",
  }
  expect(await resolveFeatures(identity)).toBeNull()
})

test("a B2C person: their own record", async () => {
  mockModel.externalEntitlements.findUser.mockResolvedValue([
    userRecord({ email: "jdoe@twake.app" }),
  ])
  const out = await resolveFeatures({
    provider: "external",
    subject: "jdoe",
    email: "jdoe@twake.app",
  })
  expect(out).toEqual(LIVE_ONLY)
})

test("a member of a declared domain: the domain's features", async () => {
  mockModel.externalEntitlements.findDomain.mockResolvedValue([domainRecord()])
  const out = await resolveFeatures({
    provider: "meet:linagora",
    subject: "lemon-42",
    email: "alice@collectivite.fr",
  })
  expect(out).toEqual(BOTH)
})

test("a record on the person wins over their domain", async () => {
  mockModel.externalEntitlements.findUser.mockResolvedValue([userRecord()])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([domainRecord()])
  const out = await resolveFeatures({
    provider: "external",
    subject: "jdoe",
    email: "jdoe@collectivite.fr",
  })
  expect(out).toEqual(LIVE_ONLY)
})

test("the subject at its provider wins over a newer record found by email", async () => {
  mockModel.externalEntitlements.findUser.mockResolvedValue([
    userRecord({ provider: "other", subject: "x", features: {} }),
    userRecord(),
  ])
  const identity = {
    provider: "external",
    subject: "jdoe",
    email: "jdoe@collectivite.fr",
  }
  expect(await resolveFeatures(identity)).toEqual(LIVE_ONLY)
})

test("the email is the pivot when the subject is unknown at this provider", async () => {
  mockModel.externalEntitlements.findUser.mockResolvedValue([
    userRecord({ provider: "other" }),
  ])
  const out = await resolveFeatures({
    provider: "meet:linagora",
    subject: "lemon-42",
    email: "jdoe@collectivite.fr",
  })
  expect(out).toEqual(LIVE_ONLY)
})

test("only the records of the requested root are read", async () => {
  const identity = {
    provider: "external",
    subject: "jdoe",
    email: "jdoe@collectivite.fr",
  }
  const records = [
    userRecord({ organizationId: OTHER_ROOT, features: BOTH }),
    domainRecord({ organizationId: OTHER_ROOT }),
  ]
  mockModel.externalEntitlements.findUser.mockImplementation(
    async (organizationId) =>
      records.filter(
        (r) => r.kind === "user" && r.organizationId === organizationId,
      ),
  )
  mockModel.externalEntitlements.findDomain.mockImplementation(
    async (organizationId, domain) =>
      records.filter(
        (r) =>
          r.kind === "domain" &&
          r.organizationId === organizationId &&
          r.domain === domain,
      ),
  )
  expect(await resolveFeatures(identity)).toBeNull()
  expect(mockModel.externalEntitlements.findUser).toHaveBeenCalledWith(
    ROOT,
    identity,
  )
  expect(mockModel.externalEntitlements.findDomain).toHaveBeenCalledWith(
    ROOT,
    "collectivite.fr",
  )
  expect(await resolve.resolveFeatures(identity, OTHER_ROOT)).toEqual(BOTH)
})

test("a database failure is thrown, never read as no entitlement", async () => {
  mockModel.externalEntitlements.findUser.mockRejectedValue(new Error("down"))
  await expect(
    resolveFeatures({ provider: "external", subject: "jdoe" }),
  ).rejects.toThrow("down")
})

describe("capabilities", () => {
  test("absent is false, unknown features are carried as they come", () => {
    expect(capabilitiesFrom({ transcription: { live: true } })).toEqual({
      quickMeeting: true,
      transcription: { live: true, async: false },
    })
    expect(capabilitiesFrom({})).toEqual({
      quickMeeting: false,
      transcription: { live: false, async: false },
    })
    expect(
      capabilitiesFrom({ summary: true, unknown: { deep: true } }),
    ).toEqual({
      quickMeeting: false,
      transcription: { live: false, async: false },
      summary: true,
      unknown: { deep: true },
    })
  })

  test("a key barred from quick meetings never gets one", () => {
    const barred = { type: "machine", metadata: { quickMeeting: false } }
    expect(capabilitiesFrom(BOTH, barred).quickMeeting).toBe(false)
    expect(canQuickMeeting(barred, null)).toBe(false)
    expect(canQuickMeeting({ type: "user" }, null)).toBe(true)
    expect(canQuickMeeting({ type: "machine" }, {})).toBe(false)
    expect(canQuickMeeting({ type: "machine" }, LIVE_ONLY)).toBe(true)
  })

  test("hasFeature walks the path, an absent key is false", () => {
    expect(hasFeature(BOTH, "transcription.async")).toBe(true)
    expect(hasFeature(LIVE_ONLY, "transcription.async")).toBe(false)
    expect(hasFeature({}, "transcription.live")).toBe(false)
    expect(hasFeature(undefined, "summary")).toBe(false)
  })

  test("hasActiveFeature: any true leaf, however deep", () => {
    expect(hasActiveFeature({ recording: true })).toBe(true)
    expect(hasActiveFeature({ a: { b: { c: true } } })).toBe(true)
    expect(hasActiveFeature({ transcription: { live: false } })).toBe(false)
    expect(hasActiveFeature({})).toBe(false)
    expect(hasActiveFeature([true])).toBe(false)
    expect(hasActiveFeature(undefined)).toBe(false)
  })

  test("hasLintoFeature: the features LinTO serves, not `recording`", () => {
    expect(hasLintoFeature({ recording: true })).toBe(false)
    expect(hasLintoFeature({ recording: true, unknown: true })).toBe(false)
    expect(hasLintoFeature({ recording: true, summary: true })).toBe(true)
    expect(hasLintoFeature(LIVE_ONLY)).toBe(true)
    expect(hasLintoFeature({ transcription: { async: true } })).toBe(true)
    expect(hasLintoFeature({ translation: true })).toBe(true)
    expect(hasLintoFeature({})).toBe(false)
    expect(hasLintoFeature(undefined)).toBe(false)
  })
})
