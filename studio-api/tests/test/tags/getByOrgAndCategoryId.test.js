const mockToArray = jest.fn()
const mockAggregate = jest.fn(() => ({ toArray: mockToArray }))
const mockCollection = jest.fn(() => ({ aggregate: mockAggregate }))

jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: {
    db: { collection: mockCollection },
    mongoDb: { ObjectId: require("bson").ObjectId },
  },
}))

jest.mock(`${process.cwd()}/lib/dao/organization/color`, () => ({
  getRandomColor: jest.fn(() => "#000000"),
}))

jest.mock(`${process.cwd()}/config/tags`, () => [])

jest.mock("debug", () => () => () => {})

const { ObjectId } = require("bson")

const orgId = new ObjectId()
const catId = new ObjectId()
const tagId1 = new ObjectId()
const tagId2 = new ObjectId()
const tagId3 = new ObjectId()

const mockTags = [
  { _id: tagId1, name: "Tag1", organizationId: orgId, categoryId: catId },
  { _id: tagId2, name: "Tag2", organizationId: orgId, categoryId: catId },
  { _id: tagId3, name: "Tag3", organizationId: orgId, categoryId: catId },
]

const tagsModel = require(`${process.cwd()}/lib/mongodb/models/tags`)

describe("TagModel.getByOrgAndCategoryId", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("without withMediaCount", () => {
    it("should return tags without mediaCount", async () => {
      tagsModel.mongoRequest = jest.fn().mockResolvedValue(mockTags)

      const result = await tagsModel.getByOrgAndCategoryId(
        orgId.toString(),
        catId.toString(),
        false,
      )

      expect(tagsModel.mongoRequest).toHaveBeenCalledWith({
        organizationId: expect.any(ObjectId),
        categoryId: expect.any(ObjectId),
      })
      expect(result).toEqual(mockTags)
      expect(mockCollection).not.toHaveBeenCalled()
    })

    it("should not query conversations when withMediaCount is omitted", async () => {
      tagsModel.mongoRequest = jest.fn().mockResolvedValue(mockTags)

      await tagsModel.getByOrgAndCategoryId(
        orgId.toString(),
        catId.toString(),
      )

      expect(mockCollection).not.toHaveBeenCalled()
    })
  })

  describe("with withMediaCount=true", () => {
    it("should return tags with correct mediaCount", async () => {
      tagsModel.mongoRequest = jest.fn().mockResolvedValue(mockTags)
      mockToArray.mockResolvedValue([
        { _id: tagId1.toString(), count: 5 },
        { _id: tagId2.toString(), count: 2 },
      ])

      const result = await tagsModel.getByOrgAndCategoryId(
        orgId.toString(),
        catId.toString(),
        true,
      )

      expect(result).toEqual([
        { ...mockTags[0], mediaCount: 5 },
        { ...mockTags[1], mediaCount: 2 },
        { ...mockTags[2], mediaCount: 0 },
      ])
    })

    it("should query conversations collection with correct pipeline", async () => {
      tagsModel.mongoRequest = jest.fn().mockResolvedValue(mockTags)
      mockToArray.mockResolvedValue([])

      await tagsModel.getByOrgAndCategoryId(
        orgId.toString(),
        catId.toString(),
        true,
      )

      expect(mockCollection).toHaveBeenCalledWith("conversations")

      const pipeline = mockAggregate.mock.calls[0][0]

      // First $match uses standard query (no $expr) for index usage
      expect(pipeline[0]).toEqual({
        $match: {
          "organization.organizationId": orgId.toString(),
          tags: {
            $in: mockTags.map((t) => t._id.toString()),
          },
        },
      })

      // $unwind stage
      expect(pipeline[1]).toEqual({ $unwind: "$tags" })

      // Second $match filters unwound tags
      expect(pipeline[2]).toEqual({
        $match: {
          tags: { $in: mockTags.map((t) => t._id.toString()) },
        },
      })

      // $group stage counts per tag
      expect(pipeline[3]).toEqual({
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      })
    })

    it("should return empty tags when no tags exist", async () => {
      tagsModel.mongoRequest = jest.fn().mockResolvedValue([])

      const result = await tagsModel.getByOrgAndCategoryId(
        orgId.toString(),
        catId.toString(),
        true,
      )

      expect(result).toEqual([])
      expect(mockCollection).not.toHaveBeenCalled()
    })

    it("should set mediaCount to 0 for tags with no conversations", async () => {
      tagsModel.mongoRequest = jest.fn().mockResolvedValue([mockTags[0]])
      mockToArray.mockResolvedValue([])

      const result = await tagsModel.getByOrgAndCategoryId(
        orgId.toString(),
        catId.toString(),
        true,
      )

      expect(result).toEqual([{ ...mockTags[0], mediaCount: 0 }])
    })
  })

  describe("error handling", () => {
    it("should throw on failure", async () => {
      const error = new Error("DB error")
      tagsModel.mongoRequest = jest.fn().mockRejectedValue(error)

      await expect(
        tagsModel.getByOrgAndCategoryId(
          orgId.toString(),
          catId.toString(),
          true,
        ),
      ).rejects.toBe(error)
    })
  })
})
