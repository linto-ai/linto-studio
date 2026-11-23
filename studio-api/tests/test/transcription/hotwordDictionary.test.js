const mockModel = {
  hotwordDictionaries: {
    create: jest.fn(),
    getByIdInOrganization: jest.fn(),
    getByOrganizationId: jest.fn(),
    getByOrganizationIdAndName: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const {
  createHotwordDictionary,
  updateHotwordDictionary,
  deleteHotwordDictionary,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/hotwordDictionary`,
)

const ORG_ID = "0123456789abcdef01234567"
const stored = {
  _id: { toString: () => "dict1" },
  organizationId: { toString: () => ORG_ID },
  name: "Products",
  description: "",
  words: ["LinTO"],
}

async function run(controller, { params = {}, body = {} } = {}) {
  const req = { params: { organizationId: ORG_ID, ...params }, body }
  const res = {
    status: jest.fn(function () {
      return this
    }),
    send: jest.fn(),
  }
  const next = jest.fn()
  await controller(req, res, next)
  return { res, next }
}

describe("hotword dictionaries", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.hotwordDictionaries.getByIdInOrganization.mockResolvedValue([
      stored,
    ])
    mockModel.hotwordDictionaries.getByOrganizationIdAndName.mockResolvedValue(
      [],
    )
    mockModel.hotwordDictionaries.create.mockResolvedValue({
      insertedCount: 1,
      insertedId: { toString: () => "dict1" },
    })
    mockModel.hotwordDictionaries.update.mockResolvedValue({
      modifiedCount: 1,
    })
    mockModel.hotwordDictionaries.delete.mockResolvedValue({ deletedCount: 1 })
  })

  it("creates a dictionary with its cleaned words", async () => {
    const { res } = await run(createHotwordDictionary, {
      body: { name: " Products ", words: [" LinTO ", "linto", "Twake"] },
    })
    expect(mockModel.hotwordDictionaries.create).toHaveBeenCalledWith({
      name: "Products",
      description: "",
      organizationId: ORG_ID,
      words: ["LinTO", "Twake"],
    })
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("refuses a dictionary without name or with invalid words", async () => {
    const unnamed = await run(createHotwordDictionary, { body: { words: [] } })
    expect(unnamed.next.mock.calls[0][0].status).toBe(400)

    const withComma = await run(createHotwordDictionary, {
      body: { name: "Products", words: ["LinTO, Twake"] },
    })
    expect(withComma.next.mock.calls[0][0].status).toBe(400)
    expect(mockModel.hotwordDictionaries.create).not.toHaveBeenCalled()
  })

  it("refuses a name already taken in the organization", async () => {
    mockModel.hotwordDictionaries.getByOrganizationIdAndName.mockResolvedValue([
      stored,
    ])
    const { next } = await run(createHotwordDictionary, {
      body: { name: "products" },
    })
    expect(next.mock.calls[0][0].status).toBe(409)
  })

  it("lets a dictionary keep its own name on update", async () => {
    mockModel.hotwordDictionaries.getByOrganizationIdAndName.mockResolvedValue([
      stored,
    ])
    const { res, next } = await run(updateHotwordDictionary, {
      params: { dictionaryId: "dict1" },
      body: { name: "Products", words: ["Twake"] },
    })
    expect(next).not.toHaveBeenCalled()
    expect(mockModel.hotwordDictionaries.update).toHaveBeenCalledWith({
      _id: stored._id,
      name: "Products",
      words: ["Twake"],
    })
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it("hides the dictionary of another organization", async () => {
    mockModel.hotwordDictionaries.getByIdInOrganization.mockResolvedValue([])
    for (const controller of [
      updateHotwordDictionary,
      deleteHotwordDictionary,
    ]) {
      const { next } = await run(controller, {
        params: { dictionaryId: "dict1" },
      })
      expect(next.mock.calls[0][0].status).toBe(404)
    }
    expect(
      mockModel.hotwordDictionaries.getByIdInOrganization,
    ).toHaveBeenCalledWith("dict1", ORG_ID)
    expect(mockModel.hotwordDictionaries.delete).not.toHaveBeenCalled()
  })
})
