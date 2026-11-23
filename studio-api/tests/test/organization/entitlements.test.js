jest.mock("debug", () => () => () => {})

// The externalEntitlements collection in memory, with the guard of the model
const mockStore = new Map()
const mockKeyOf = (key) =>
  JSON.stringify([
    key.organizationId,
    key.provider,
    key.kind,
    key.email ?? key.domain,
  ])
const mockFound = (key) => {
  const record = mockStore.get(mockKeyOf(key))
  return record
    ? [{ ...record, features: JSON.parse(JSON.stringify(record.features)) }]
    : []
}
const mockModel = {
  externalEntitlements: {
    getUser: jest.fn(async (organizationId, provider, email) =>
      mockFound({ organizationId, provider, kind: "user", email }),
    ),
    getDomain: jest.fn(async (organizationId, provider, domain) =>
      mockFound({ organizationId, provider, kind: "domain", domain }),
    ),
    findUser: jest.fn(async () => []),
    findDomain: jest.fn(async (organizationId, domain) =>
      [...mockStore.values()].filter(
        (record) =>
          record.kind === "domain" &&
          record.organizationId === organizationId &&
          record.domain === domain,
      ),
    ),
    upsertUnlessNewer: jest.fn(async (key, values, onInsert = {}) => {
      const stored = mockStore.get(mockKeyOf(key))
      if (stored && values.updatedAt && stored.updatedAt > values.updatedAt) {
        return false
      }
      mockStore.set(mockKeyOf(key), {
        ...(stored || {
          _id: mockKeyOf(key),
          ...key,
          ...onInsert,
          created: new Date(),
        }),
        ...values,
        updatedAt: values.updatedAt || new Date(),
        last_update: "l",
      })
      return true
    }),
    deleteUnlessNewer: jest.fn(async (key, updatedAt) => {
      const stored = mockStore.get(mockKeyOf(key))
      if (!stored || (updatedAt && stored.updatedAt > updatedAt)) return false
      mockStore.delete(mockKeyOf(key))
      return true
    }),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const {
  putUserEntitlement,
  deleteUserEntitlement,
  getUserEntitlement,
  putDomainEntitlement,
  getDomainEntitlement,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/entitlements`,
)
const { parseFeatures } = require(
  `${process.cwd()}/lib/dao/entitlement/features`,
)
const { resolveFeatures } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)

const ROOT = "0123456789abcdef01234567"
const CALLER = "cccccccccccccccccccccccc"
const LIVE = { transcription: { live: true, async: true } }
const USER = { organizationId: ROOT, provider: "external", kind: "user" }

function res() {
  const r = { status: jest.fn(() => r), send: jest.fn(() => r) }
  return r
}
async function call(controller, r) {
  const rs = res()
  const next = jest.fn()
  await controller(
    { payload: { data: { userId: CALLER } }, query: {}, body: {}, ...r },
    rs,
    next,
  )
  const sent = rs.send.mock.calls[0]?.[0]
  return {
    rs,
    next,
    err: next.mock.calls[0]?.[0],
    status: rs.status.mock.calls[0]?.[0],
    // as the client reads it
    body: sent === undefined ? undefined : JSON.parse(JSON.stringify(sent)),
  }
}

const putUser = (body, email = "jdoe@twake.app") =>
  call(putUserEntitlement, {
    params: { organizationId: ROOT, email },
    body,
  })
const putDomain = (body, domain = "collectivite.fr") =>
  call(putDomainEntitlement, {
    params: { organizationId: ROOT, domain },
    body,
  })
const storedUser = (email = "jdoe@twake.app") =>
  mockStore.get(mockKeyOf({ ...USER, email }))

beforeEach(() => {
  jest.clearAllMocks()
  mockStore.clear()
})

describe("features", () => {
  test("keeps unknown keys and nested objects, absent stays absent", () => {
    expect(
      parseFeatures({
        transcription: { live: true, async: false },
        summary: false,
        unknownFeature: { deep: true },
      }),
    ).toEqual({
      transcription: { live: true, async: false },
      summary: false,
      unknownFeature: { deep: true },
    })
    expect(parseFeatures({})).toEqual({})
  })

  test("refuses a value that is neither a boolean nor an object", () => {
    expect(() => parseFeatures({ transcription: "yes" })).toThrow(
      /transcription must be a boolean or an object/,
    )
    expect(() => parseFeatures({ a: { b: 1 } })).toThrow(
      /features\.a\.b must be a boolean or an object/,
    )
  })
})

describe("PUT users/{email}", () => {
  test("upserts, answers 200 (never 201), lowercases the email", async () => {
    const { status, body, err } = await putUser(
      {
        subject: "jdoe",
        features: LIVE,
        plan: "premium",
        updatedAt: "2026-09-14T10:32:00Z",
      },
      "JDoe%40Twake.app",
    )
    expect(err).toBeUndefined()
    expect(status).toBe(200)
    expect(body).toEqual({
      ...USER,
      email: "jdoe@twake.app",
      subject: "jdoe",
      features: LIVE,
      plan: "premium",
      updatedAt: "2026-09-14T10:32:00.000Z",
    })
  })

  test("updatedAt and created are stored as dates, answered as ISO 8601", async () => {
    await putUser({ features: LIVE, updatedAt: "2026-09-14T12:32:00+02:00" })
    expect(storedUser().updatedAt).toEqual(new Date("2026-09-14T10:32:00Z"))
    expect(storedUser().created).toBeInstanceOf(Date)
    const { body } = await call(getUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(body.updatedAt).toBe("2026-09-14T10:32:00.000Z")
    expect(body.created).toBeUndefined()
  })

  test("replaying the same message twice lands on the same state", async () => {
    const message = {
      subject: "jdoe",
      features: LIVE,
      updatedAt: "2026-09-14T10:32:00Z",
    }
    const first = await putUser(message)
    const created = storedUser().created
    const second = await putUser(message)
    expect(second.status).toBe(200)
    expect(second.body).toEqual(first.body)
    expect(second.body.ignored).toBeUndefined()
    expect(mockStore.size).toBe(1)
    expect(storedUser().created).toBe(created)
  })

  test("an older PUT after a newer one is ignored (200 {ignored:true})", async () => {
    await putUser({
      subject: "jdoe",
      features: LIVE,
      updatedAt: "2026-09-14T10:32:00Z",
    })
    const { status, body } = await putUser({
      features: {},
      updatedAt: "2026-09-14T09:00:00Z",
    })
    expect(status).toBe(200)
    expect(body).toEqual({
      ...USER,
      email: "jdoe@twake.app",
      subject: "jdoe",
      features: LIVE,
      plan: null,
      updatedAt: "2026-09-14T10:32:00.000Z",
      ignored: true,
    })
    expect(storedUser().features).toEqual(LIVE)
  })

  test("a newer empty features takes the rights away, the rest is kept", async () => {
    await putUser({
      subject: "jdoe",
      features: LIVE,
      plan: "premium",
      updatedAt: "2026-09-14T10:32:00Z",
    })
    const { status, body } = await putUser({
      features: {},
      updatedAt: "2026-09-15T10:32:00Z",
    })
    expect(status).toBe(200)
    expect(body.features).toEqual({})
    expect(body.subject).toBe("jdoe")
    expect(body.plan).toBe("premium")
  })

  test("a message without updatedAt is written at server time", async () => {
    await putUser({ features: LIVE, updatedAt: "2099-01-01T00:00:00Z" })
    const before = Date.now()
    const { body } = await putUser({ features: {} })
    expect(body.ignored).toBeUndefined()
    expect(body.features).toEqual({})
    expect(new Date(body.updatedAt).getTime()).toBeGreaterThanOrEqual(before)
  })

  test("400 on an invalid body or email, nothing written", async () => {
    const noFeatures = await putUser({ subject: "jdoe" })
    expect(noFeatures.err.status).toBe(400)
    expect(noFeatures.err.error).toMatch(/features is required/)

    const badEmail = await putUser({ features: {} }, "not-an-email")
    expect(badEmail.err.status).toBe(400)

    const badDate = await putUser({ features: {}, updatedAt: "yesterday" })
    expect(badDate.err.status).toBe(400)
    expect(mockStore.size).toBe(0)
  })

  test("two PUTs in any order of arrival end on the newer one", async () => {
    const OLDER = "2026-09-14T10:00:00Z"
    const NEWER = "2026-09-14T11:00:00Z"
    for (const order of [
      [OLDER, NEWER],
      [NEWER, OLDER],
    ]) {
      mockStore.clear()
      await Promise.all(
        order.map((updatedAt) =>
          putUser({
            subject: "jdoe",
            features: updatedAt === NEWER ? {} : LIVE,
            updatedAt,
          }),
        ),
      )
      expect(storedUser().features).toEqual({})
      expect(storedUser().updatedAt).toEqual(new Date(NEWER))
    }
  })

  test("a database failure is a server error, not an answer", async () => {
    mockModel.externalEntitlements.getUser.mockRejectedValueOnce(
      new Error("down"),
    )
    const { err, status } = await putUser({ features: LIVE })
    expect(err.message).toBe("down")
    expect(status).toBeUndefined()
  })
})

describe("DELETE users/{email}", () => {
  test("204, and 204 again when nothing was there", async () => {
    await putUser({ subject: "jdoe", features: LIVE })
    const first = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(first.status).toBe(204)
    expect(first.body).toBeUndefined()
    expect(storedUser()).toBeUndefined()

    const second = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(second.status).toBe(204)
    expect(second.err).toBeUndefined()
  })

  test("the provider is read from the query, as GET reads it", async () => {
    await putUser({ provider: "twake", subject: "jdoe", features: LIVE })
    await putUser({ subject: "jdoe", features: LIVE })
    const out = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      query: { provider: "twake" },
      body: { provider: "ignored" },
    })
    expect(out.status).toBe(204)
    expect(
      mockFound({ ...USER, provider: "twake", email: "jdoe@twake.app" }),
    ).toEqual([])
    expect(storedUser()).toBeDefined()
  })

  test("updatedAt: a later state is kept and answered as ignored", async () => {
    await putUser({
      subject: "jdoe",
      features: LIVE,
      updatedAt: "2026-09-14T10:32:00Z",
    })
    const older = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      query: { updatedAt: "2026-09-14T10:00:00Z" },
    })
    expect(older.status).toBe(200)
    expect(older.body).toMatchObject({
      ...USER,
      email: "jdoe@twake.app",
      features: LIVE,
      updatedAt: "2026-09-14T10:32:00.000Z",
      ignored: true,
    })
    expect(storedUser()).toBeDefined()

    const later = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      query: { updatedAt: "2026-09-14T10:32:00Z" },
    })
    expect(later.status).toBe(204)
    expect(storedUser()).toBeUndefined()

    const gone = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      query: { updatedAt: "2026-09-14T11:00:00Z" },
    })
    expect(gone.status).toBe(204)
  })

  test("400 on an updatedAt that is not a date", async () => {
    const { err } = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      query: { updatedAt: "yesterday" },
    })
    expect(err).toMatchObject({ status: 400, code: "invalid_body" })
  })
})

describe("GET users/{email} and domains/{domain}", () => {
  test("200 with the current state, 404 when unknown", async () => {
    await putUser({
      subject: "jdoe",
      features: LIVE,
      updatedAt: "2026-09-14T10:32:00Z",
    })
    const found = await call(getUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(found.status).toBe(200)
    expect(found.body).toEqual({
      ...USER,
      email: "jdoe@twake.app",
      subject: "jdoe",
      features: LIVE,
      plan: null,
      updatedAt: "2026-09-14T10:32:00.000Z",
    })

    const missing = await call(getUserEntitlement, {
      params: { organizationId: ROOT, email: "nobody@twake.app" },
    })
    expect(missing.err.status).toBe(404)

    const noDomain = await call(getDomainEntitlement, {
      params: { organizationId: ROOT, domain: "collectivite.fr" },
    })
    expect(noDomain.err.status).toBe(404)
  })

  test("a domain answers its record", async () => {
    await putDomain({ features: LIVE, updatedAt: "2026-09-14T10:32:00Z" })
    const { body } = await call(getDomainEntitlement, {
      params: { organizationId: ROOT, domain: "collectivite.fr" },
    })
    expect(body).toEqual({
      kind: "domain",
      organizationId: ROOT,
      provider: "external",
      domain: "collectivite.fr",
      features: LIVE,
      plan: null,
      updatedAt: "2026-09-14T10:32:00.000Z",
    })
  })
})

describe("PUT domains/{domain}", () => {
  test("upserts the record of the domain under the root", async () => {
    const message = {
      features: LIVE,
      plan: "78acf033",
      updatedAt: "2026-09-14T10:32:00Z",
    }
    const first = await putDomain(message, "Collectivite.FR")
    expect(first.status).toBe(200)
    expect(first.body).toEqual({
      kind: "domain",
      organizationId: ROOT,
      provider: "external",
      domain: "collectivite.fr",
      features: LIVE,
      plan: "78acf033",
      updatedAt: "2026-09-14T10:32:00.000Z",
    })

    const second = await putDomain(message)
    expect(second.body).toEqual(first.body)
    expect(mockStore.size).toBe(1)
  })

  test("a member of a domain given a right resolves to it", async () => {
    await putDomain({ features: LIVE })
    expect(
      await resolveFeatures(
        {
          provider: "meet:linagora",
          subject: "lemon-42",
          email: "alice@collectivite.fr",
        },
        ROOT,
      ),
    ).toEqual(LIVE)
  })

  test("empty features take the rights away, the record stays", async () => {
    await putDomain({ features: LIVE, updatedAt: "2026-09-14T10:32:00Z" })
    const { status, body } = await putDomain({
      features: {},
      updatedAt: "2026-09-20T10:32:00Z",
    })
    expect(status).toBe(200)
    expect(body.features).toEqual({})
    expect(mockStore.size).toBe(1)
  })

  test("an older PUT is ignored and answers the stored state", async () => {
    await putDomain({ features: {}, updatedAt: "2026-09-14T10:32:00Z" })
    const { status, body } = await putDomain({
      features: LIVE,
      updatedAt: "2026-09-01T10:32:00Z",
    })
    expect(status).toBe(200)
    expect(body.ignored).toBe(true)
    expect(body.features).toEqual({})
  })

  test("400 when a domain message carries a subject", async () => {
    const { err } = await putDomain({ subject: "nope", features: LIVE })
    expect(err.status).toBe(400)
    expect(mockStore.size).toBe(0)
  })
})
