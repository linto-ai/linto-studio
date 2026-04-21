const { toObjectIds } = require(
  `${process.cwd()}/lib/mongodb/queryBuilders/ids`,
)
const {
  customRightsAllowed,
  customRightsNotMember,
  sharedWithUsersAllowed,
} = require(`${process.cwd()}/lib/mongodb/queryBuilders/rights`)
const { applyNameTextSearch, applyTagAllFilter } = require(
  `${process.cwd()}/lib/mongodb/queryBuilders/filters`,
)

describe("queryBuilders/ids", () => {
  const fakeGetObjectId = (id) => ({ wrapped: id })

  it("converts string ids via getObjectId", () => {
    const result = toObjectIds(["a", "b"], fakeGetObjectId)
    expect(result).toEqual([{ wrapped: "a" }, { wrapped: "b" }])
  })

  it("passes non-string ids through unchanged", () => {
    const obj = { some: "oid" }
    const result = toObjectIds([obj, "x"], fakeGetObjectId)
    expect(result[0]).toBe(obj)
    expect(result[1]).toEqual({ wrapped: "x" })
  })

  it("returns an empty array for an empty input", () => {
    expect(toObjectIds([], fakeGetObjectId)).toEqual([])
  })
})

describe("queryBuilders/rights", () => {
  it("customRightsAllowed matches the original shape", () => {
    expect(customRightsAllowed("user-1", 3)).toEqual({
      "organization.customRights": {
        $elemMatch: {
          userId: "user-1",
          right: { $bitsAnySet: 3 },
        },
      },
    })
  })

  it("customRightsNotMember matches the original shape", () => {
    expect(customRightsNotMember("user-1")).toEqual({
      "organization.customRights": {
        $not: {
          $elemMatch: {
            userId: "user-1",
          },
        },
      },
    })
  })

  it("sharedWithUsersAllowed matches the original shape", () => {
    expect(sharedWithUsersAllowed("user-1", 1)).toEqual({
      sharedWithUsers: {
        $elemMatch: {
          userId: "user-1",
          right: { $bitsAnySet: 1 },
        },
      },
    })
  })
})

describe("queryBuilders/filters", () => {
  describe("applyNameTextSearch", () => {
    it("does nothing when neither name nor text is set", () => {
      const query = { foo: 1 }
      applyNameTextSearch(query, {})
      expect(query).toEqual({ foo: 1 })
    })

    it("adds only name condition when text is missing", () => {
      const query = {}
      applyNameTextSearch(query, { name: "abc" })
      expect(query).toEqual({
        $and: [{ $or: [{ name: { $regex: "abc", $options: "i" } }] }],
      })
    })

    it("adds only text condition when name is missing", () => {
      const query = {}
      applyNameTextSearch(query, { text: "hello" })
      expect(query).toEqual({
        $and: [
          {
            $or: [{ "text.raw_segment": { $regex: "hello", $options: "i" } }],
          },
        ],
      })
    })

    it("adds both conditions in name-first order when both are set", () => {
      const query = {}
      applyNameTextSearch(query, { name: "n", text: "t" })
      expect(query.$and).toEqual([
        {
          $or: [
            { name: { $regex: "n", $options: "i" } },
            { "text.raw_segment": { $regex: "t", $options: "i" } },
          ],
        },
      ])
    })

    it("does nothing when filter is undefined", () => {
      const query = { foo: 1 }
      applyNameTextSearch(query, undefined)
      expect(query).toEqual({ foo: 1 })
    })
  })

  describe("applyTagAllFilter", () => {
    it("does nothing when filter.tags is missing", () => {
      const query = {}
      applyTagAllFilter(query, {})
      expect(query).toEqual({})
    })

    it("splits comma-separated tags and sets $all", () => {
      const query = {}
      applyTagAllFilter(query, { tags: "a,b,c" })
      expect(query).toEqual({ tags: { $all: ["a", "b", "c"] } })
    })

    it("handles a single tag", () => {
      const query = {}
      applyTagAllFilter(query, { tags: "only" })
      expect(query).toEqual({ tags: { $all: ["only"] } })
    })

    it("does nothing when filter is undefined", () => {
      const query = {}
      applyTagAllFilter(query, undefined)
      expect(query).toEqual({})
    })
  })
})
