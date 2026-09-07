jest.mock("debug", () => () => () => {})

const {
  SPEAKER_TYPE,
  OBJECT_ID_REGEX,
  QDRANT_COLLECTION_REGEX,
  SPEAKER_REF_REGEX,
  qdrantCollectionName,
  speakerRef,
  displayName,
} = require(`${process.cwd()}/lib/dao/speakerIdentification/naming`)
const { escapeRegex } = require(`${process.cwd()}/lib/utility/escapeRegex`)

const ORG_ID = "0123456789abcdef01234567"
const COLL_ID = "89abcdef0123456789abcdef"

describe("speakerIdentification/naming", () => {
  describe("qdrantCollectionName", () => {
    it("builds spkid_{orgId}_{collectionId} from strings", () => {
      expect(qdrantCollectionName(ORG_ID, COLL_ID)).toBe(
        `spkid_${ORG_ID}_${COLL_ID}`,
      )
    })

    it("matches the QDRANT_COLLECTION_REGEX", () => {
      const name = qdrantCollectionName(ORG_ID, COLL_ID)
      expect(QDRANT_COLLECTION_REGEX.test(name)).toBe(true)
    })

    it("calls toString() on object-like ids (ObjectId)", () => {
      const orgObj = { toString: () => ORG_ID }
      const collObj = { toString: () => COLL_ID }
      expect(qdrantCollectionName(orgObj, collObj)).toBe(
        `spkid_${ORG_ID}_${COLL_ID}`,
      )
    })
  })

  describe("speakerRef", () => {
    it("builds label:{id}", () => {
      expect(speakerRef(SPEAKER_TYPE.LABEL, COLL_ID)).toBe(`label:${COLL_ID}`)
    })

    it("builds user:{id}", () => {
      expect(speakerRef(SPEAKER_TYPE.USER, ORG_ID)).toBe(`user:${ORG_ID}`)
    })

    it("matches SPEAKER_REF_REGEX", () => {
      expect(SPEAKER_REF_REGEX.test(speakerRef(SPEAKER_TYPE.LABEL, COLL_ID))).toBe(
        true,
      )
      expect(SPEAKER_REF_REGEX.test(speakerRef(SPEAKER_TYPE.USER, ORG_ID))).toBe(
        true,
      )
    })

    it("calls toString() on object-like ids", () => {
      const idObj = { toString: () => COLL_ID }
      expect(speakerRef(SPEAKER_TYPE.LABEL, idObj)).toBe(`label:${COLL_ID}`)
    })

    it("throws on an invalid speaker type", () => {
      expect(() => speakerRef("group", COLL_ID)).toThrow(
        /Invalid speaker reference type/,
      )
      expect(() => speakerRef("", COLL_ID)).toThrow()
      expect(() => speakerRef(undefined, COLL_ID)).toThrow()
    })
  })

  describe("displayName", () => {
    it("concatenates firstname and lastname", () => {
      expect(displayName({ firstname: "Jane", lastname: "Doe" })).toBe(
        "Jane Doe",
      )
    })

    it("uses only firstname when lastname is missing", () => {
      expect(displayName({ firstname: "Jane" })).toBe("Jane")
    })

    it("uses only lastname when firstname is missing", () => {
      expect(displayName({ lastname: "Doe" })).toBe("Doe")
    })

    it("falls back to email when no name is available", () => {
      expect(displayName({ email: "jane@example.com" })).toBe(
        "jane@example.com",
      )
    })

    it("returns empty string for null/undefined user", () => {
      expect(displayName(null)).toBe("")
      expect(displayName(undefined)).toBe("")
    })

    it("returns empty string when nothing usable is present", () => {
      expect(displayName({})).toBe("")
    })
  })

  describe("escapeRegex", () => {
    it("escapes regex metacharacters", () => {
      expect(escapeRegex("a.b*c")).toBe("a\\.b\\*c")
      expect(escapeRegex("(x)[y]")).toBe("\\(x\\)\\[y\\]")
    })

    it("leaves plain strings untouched", () => {
      expect(escapeRegex("JaneDoe")).toBe("JaneDoe")
    })

    it("produces a string usable as a literal regex", () => {
      const literal = "a.b(c)"
      const re = new RegExp("^" + escapeRegex(literal) + "$")
      expect(re.test(literal)).toBe(true)
      expect(re.test("axb(c)")).toBe(false)
    })
  })

  describe("regexes", () => {
    it("OBJECT_ID_REGEX matches a 24-hex id and rejects others", () => {
      expect(OBJECT_ID_REGEX.test(ORG_ID)).toBe(true)
      expect(OBJECT_ID_REGEX.test("xyz")).toBe(false)
      expect(OBJECT_ID_REGEX.test(ORG_ID.toUpperCase())).toBe(false)
    })

    it("QDRANT_COLLECTION_REGEX rejects malformed names", () => {
      expect(QDRANT_COLLECTION_REGEX.test("spkid_" + ORG_ID)).toBe(false)
      expect(QDRANT_COLLECTION_REGEX.test("prefix_" + ORG_ID + "_" + COLL_ID)).toBe(
        false,
      )
    })

    it("SPEAKER_REF_REGEX rejects unknown prefixes", () => {
      expect(SPEAKER_REF_REGEX.test("group:" + COLL_ID)).toBe(false)
      expect(SPEAKER_REF_REGEX.test("label:nothex")).toBe(false)
    })
  })
})
