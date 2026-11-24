// A media gets its deletion date when it is created, from the retention of
// its organization. Once the date is over it is deleted with its audio.

jest.mock("debug", () => () => () => {})

const moment = require("moment")

// The driver connects to MongoDB as soon as it is required
jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: { db: {}, mongoDb: {} },
}))

jest.mock(`${process.cwd()}/lib/mongodb/models/organizations`, () => ({
  getMediaRetention: jest.fn(),
}))

const organizations = require(
  `${process.cwd()}/lib/mongodb/models/organizations`,
)
const conversations = require(
  `${process.cwd()}/lib/mongodb/models/conversations`,
)
const EXPIRATION = require(`${process.cwd()}/lib/dao/conversation/expiration`)

function conversation(overrides = {}) {
  return {
    name: "Media",
    organization: { organizationId: "org-1" },
    type: { mode: "canonical", child_conversations: [] },
    ...overrides,
  }
}

async function create(conv) {
  await conversations.create(conv)
  return conversations.mongoInsert.mock.calls[0][0]
}

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2030-01-15T10:00:00Z"))
})

afterAll(() => {
  jest.useRealTimers()
})

beforeEach(() => {
  jest.clearAllMocks()
  organizations.getMediaRetention.mockResolvedValue({ value: 6, unit: "month" })
  conversations.mongoInsert = jest.fn(async () => ({ insertedId: "conv-1" }))
})

describe("conversations.create", () => {
  test("stamps the deletion date from the retention of the organization", async () => {
    const created = await create(conversation())

    expect(organizations.getMediaRetention).toHaveBeenCalledWith("org-1")
    expect(created.expiresAt).toBe(moment().add(6, "month").format())
  })

  test("without retention the media has no deletion date", async () => {
    organizations.getMediaRetention.mockResolvedValue(null)

    const created = await create(conversation())

    expect(created).not.toHaveProperty("expiresAt")
  })

  test("a copy does not inherit the date of its source", async () => {
    organizations.getMediaRetention.mockResolvedValue(null)

    const created = await create(
      conversation({ expiresAt: "2020-01-01T00:00:00+00:00" }),
    )

    expect(created).not.toHaveProperty("expiresAt")
  })

  test.each(["child", "translation"])(
    "a %s follows its parent: no date of its own",
    async (mode) => {
      const created = await create(
        conversation({ type: { mode, child_conversations: [] } }),
      )

      expect(organizations.getMediaRetention).not.toHaveBeenCalled()
      expect(created).not.toHaveProperty("expiresAt")
    },
  )

  test("is not created when the retention cannot be read", async () => {
    organizations.getMediaRetention.mockRejectedValue(
      new Error("database down"),
    )
    jest.spyOn(console, "error").mockImplementation(() => {})

    const result = await conversations.create(conversation())

    expect(result).toBeInstanceOf(Error)
    expect(conversations.mongoInsert).not.toHaveBeenCalled()
  })
})

describe("conversations.listExpired", () => {
  test("asks for the media whose date is over, with what the deletion reads", async () => {
    conversations.mongoRequest = jest.fn(async () => [])

    await conversations.listExpired(100)

    const [query, options] = conversations.mongoRequest.mock.calls[0]
    expect(query).toEqual({ expiresAt: { $lte: moment().format() } })
    expect(options).toEqual({
      projection: {
        type: 1,
        "metadata.audio.filepath": 1,
        "organization.organizationId": 1,
        expiresAt: 1,
      },
      sort: { expiresAt: 1 },
      limit: 100,
    })
  })
})

describe("EXPIRATION.parseDate", () => {
  test("gives a date to come in the format of the other dates", () => {
    const date = moment().add(2, "month")

    expect(EXPIRATION.parseDate(date.toISOString())).toBe(date.format())
  })

  test("reads a day alone as the beginning of this day", () => {
    const day = moment().add(1, "year").format("YYYY-MM-DD")

    expect(EXPIRATION.parseDate(day)).toBe(moment(day).startOf("day").format())
  })

  test.each([
    [moment().subtract(1, "minute").toISOString()],
    ["24/05/2030"],
    [""],
    [1893456000000],
    [null],
    [undefined],
  ])("refuses %j", (input) => {
    expect(EXPIRATION.parseDate(input)).toBeUndefined()
  })
})
