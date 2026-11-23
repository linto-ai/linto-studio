const mockModel = {
  hotwordDictionaries: { getByIdInOrganization: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const { readHotwords } = require(
  `${process.cwd()}/components/WebServer/controllers/hotwords/injection`,
)

const ORG_ID = "0123456789abcdef01234567"
const dictionaries = {
  products: { name: "Products", words: ["LinTO"] },
  people: { name: "People", words: ["linto", "Ada Lovelace"] },
}

describe("readHotwords", () => {
  beforeEach(() => {
    mockModel.hotwordDictionaries.getByIdInOrganization.mockImplementation(
      async (id, organizationId) => {
        if (organizationId !== ORG_ID || !dictionaries[id]) return []
        return [dictionaries[id]]
      },
    )
  })

  it("returns no word when the upload names no dictionary", async () => {
    const none = { words: [], dictionaryNames: [] }
    expect(await readHotwords({}, ORG_ID)).toEqual(none)
    expect(await readHotwords({ hotwordDictionaries: "" }, ORG_ID)).toEqual(
      none,
    )
    expect(await readHotwords({ hotwordDictionaries: "[]" }, ORG_ID)).toEqual(
      none,
    )
  })

  it("merges the words of the named dictionaries and gives their names", async () => {
    const body = { hotwordDictionaries: JSON.stringify(["products", "people"]) }
    expect(await readHotwords(body, ORG_ID)).toEqual({
      words: ["LinTO", "Ada Lovelace"],
      dictionaryNames: ["Products", "People"],
    })
  })

  it("refuses a dictionary that is unknown or of another organization", async () => {
    const body = { hotwordDictionaries: JSON.stringify(["products"]) }
    await expect(readHotwords(body, "another")).rejects.toMatchObject({
      status: 403,
    })
    const missing = { hotwordDictionaries: JSON.stringify(["missing"]) }
    await expect(readHotwords(missing, ORG_ID)).rejects.toMatchObject({
      status: 403,
    })
  })

  it("refuses what is not a list of ids", async () => {
    for (const value of ["products", '{"id":"products"}']) {
      await expect(
        readHotwords({ hotwordDictionaries: value }, ORG_ID),
      ).rejects.toMatchObject({ status: 400 })
    }
  })
})
