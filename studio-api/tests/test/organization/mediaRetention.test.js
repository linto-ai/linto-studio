// Media retention of an organization: a setting that gives the media created
// afterwards a deletion date. None by default.

const moment = require("moment")

const mockOrganization = () => ({
  _id: "org-1",
  name: "Organization",
  mediaRetention: { value: 1, unit: "year" },
})

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  organizations: {
    getById: jest.fn(async () => [mockOrganization()]),
    update: jest.fn(async () => ({ matchedCount: 1 })),
  },
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({}),
)

const MEDIA_RETENTION = require(
  `${process.cwd()}/lib/dao/organization/mediaRetention`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const { updateOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/admin.js`,
)

async function update(body) {
  const res = { status: jest.fn(() => res), send: jest.fn(() => res) }
  const next = jest.fn()
  await updateOrganization(
    { params: { organizationId: "org-1" }, body },
    res,
    next,
  )
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("MEDIA_RETENTION.parse", () => {
  test.each(["hour", "day", "week", "month", "year"])(
    "accepts the unit %s",
    (unit) => {
      expect(MEDIA_RETENTION.parse({ value: 3, unit })).toEqual({
        value: 3,
        unit,
      })
    },
  )

  test("reads the value given as a string", () => {
    expect(MEDIA_RETENTION.parse({ value: "2", unit: "year" })).toEqual({
      value: 2,
      unit: "year",
    })
  })

  test("drops what does not belong to a retention", () => {
    const parsed = MEDIA_RETENTION.parse({ value: 6, unit: "month", extra: 1 })

    expect(parsed).toEqual({ value: 6, unit: "month" })
  })

  test.each([
    [{ value: 0, unit: "month" }],
    [{ value: -1, unit: "month" }],
    [{ value: 1.5, unit: "year" }],
    [{ value: 121, unit: "month" }],
    [{ value: "many", unit: "month" }],
    [{ value: 6, unit: "minute" }],
    [{ value: 6 }],
    [{ unit: "month" }],
    ["6 month"],
    [6],
    [undefined],
  ])("refuses %j", (input) => {
    expect(MEDIA_RETENTION.parse(input)).toBeUndefined()
  })
})

describe("MEDIA_RETENTION.expirationDate", () => {
  test("is the given duration from now", () => {
    jest.useFakeTimers().setSystemTime(new Date("2030-01-15T10:00:00Z"))

    const date = MEDIA_RETENTION.expirationDate({ value: 6, unit: "month" })

    expect(date).toBe(moment().add(6, "month").format())
    jest.useRealTimers()
  })
})

describe("updateOrganization with mediaRetention", () => {
  test("stores the retention", async () => {
    const { res, next } = await update({
      mediaRetention: { value: 6, unit: "month" },
    })

    expect(next).not.toHaveBeenCalled()
    expect(model.organizations.update).toHaveBeenCalledWith(
      expect.objectContaining({ mediaRetention: { value: 6, unit: "month" } }),
    )
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test("null removes it", async () => {
    const { next } = await update({ mediaRetention: null })

    expect(next).not.toHaveBeenCalled()
    expect(model.organizations.update).toHaveBeenCalledWith(
      expect.objectContaining({ mediaRetention: null }),
    )
  })

  test("an update of another field leaves it as is", async () => {
    await update({ name: "Renamed" })

    expect(model.organizations.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Renamed",
        mediaRetention: { value: 1, unit: "year" },
      }),
    )
  })

  test("refuses an invalid retention without updating", async () => {
    const { next } = await update({
      mediaRetention: { value: 6, unit: "minute" },
    })

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.organizations.update).not.toHaveBeenCalled()
  })
})
