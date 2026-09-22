/**
 * Shared resolution of an external identity (VISIO-USER-API-KEY-AUTH-ANALYSIS.md
 * §4.3 [B2]): the record of the person (by subject at that provider, else by
 * email), else the record of their email domain, else nothing. A record set on
 * a person always wins over their domain; the resolution also yields the
 * TARGET organization — the domain's for a B2B member, the root for a B2C one.
 */
jest.mock("debug", () => () => () => {})

const mockModel = {
  externalEntitlements: {
    findUserBySubject: jest.fn(),
    findUserByEmail: jest.fn(),
    findDomain: jest.fn(),
    constructor: { KIND_USER: "user", KIND_DOMAIN: "domain" },
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const {
  resolveEntitlement,
  capabilitiesFrom,
  hasFeature,
  hasLintoFeature,
  LINTO_FEATURES,
} = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)

const ROOT = "0123456789abcdef01234567"
const OTHER_ROOT = "1111111111111111aaaaaaaa"
const DOMAIN_ORG = "fedcba9876543210fedcba98"
const LIVE_ONLY = { transcription: { live: true } }
const BOTH = { transcription: { live: true, async: true } }

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
  domainOrganizationId: DOMAIN_ORG,
  features: BOTH,
  ...over,
})

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([])
  mockModel.externalEntitlements.findUserByEmail.mockResolvedValue([])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
})

test("nothing recorded resolves to nothing", async () => {
  expect(
    await resolveEntitlement({
      provider: "meet:linagora",
      subject: "s",
      email: "nobody@nowhere.fr",
    }),
  ).toBeNull()
})

test("a B2C person: their own record, in the root organization", async () => {
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([
    userRecord({ email: "jdoe@twake.app" }),
  ])
  const out = await resolveEntitlement({
    provider: "external",
    subject: "jdoe",
    email: "jdoe@twake.app",
  })
  expect(out).toMatchObject({
    kind: "user",
    features: LIVE_ONLY,
    organizationId: ROOT,
    rootOrganizationId: ROOT,
  })
})

test("a member of a declared domain: the domain's features and organization", async () => {
  mockModel.externalEntitlements.findDomain.mockResolvedValue([domainRecord()])
  const out = await resolveEntitlement({
    provider: "meet:linagora",
    subject: "lemon-42",
    email: "alice@collectivite.fr",
  })
  expect(out).toMatchObject({
    kind: "domain",
    features: BOTH,
    organizationId: DOMAIN_ORG,
    rootOrganizationId: ROOT,
  })
})

test("a record on the person wins over their domain, in the domain's organization", async () => {
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([
    userRecord(),
  ])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([domainRecord()])
  const out = await resolveEntitlement({
    provider: "external",
    subject: "jdoe",
    email: "jdoe@collectivite.fr",
  })
  expect(out.kind).toBe("user")
  expect(out.features).toEqual(LIVE_ONLY)
  expect(out.organizationId).toBe(DOMAIN_ORG)
})

test("the email is the pivot when the subject is unknown at this provider", async () => {
  mockModel.externalEntitlements.findUserByEmail.mockResolvedValue([
    userRecord(),
  ])
  const out = await resolveEntitlement({
    provider: "meet:linagora",
    subject: "lemon-42",
    email: "jdoe@collectivite.fr",
  })
  expect(mockModel.externalEntitlements.findUserByEmail).toHaveBeenCalledWith({
    email: "jdoe@collectivite.fr",
  })
  expect(out.kind).toBe("user")
})

test("a domain declared under another root does not move the person", async () => {
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([
    userRecord(),
  ])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([
    domainRecord({ organizationId: OTHER_ROOT }),
  ])
  const out = await resolveEntitlement({
    provider: "external",
    subject: "jdoe",
    email: "jdoe@collectivite.fr",
  })
  expect(out.organizationId).toBe(ROOT)
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

  test("hasFeature walks the path, an absent key is false", () => {
    expect(hasFeature(BOTH, "transcription.async")).toBe(true)
    expect(hasFeature(LIVE_ONLY, "transcription.async")).toBe(false)
    expect(hasFeature({}, "transcription.live")).toBe(false)
    expect(hasFeature(undefined, "summary")).toBe(false)
  })

  test("[P13] hasLintoFeature: the features LinTO serves, not `recording`", () => {
    expect(LINTO_FEATURES).toEqual([
      "transcription.live",
      "transcription.async",
      "summary",
      "translation",
    ])
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
