const { isGenericSpeakerName, GENERIC_SPEAKER_NAMES } = require(
  `${process.cwd()}/lib/utility/isGenericSpeakerName`,
)
const { annotateLocutorDefined } = require(
  `${process.cwd()}/lib/utility/annotateLocutorDefined`,
)

describe("isGenericSpeakerName", () => {
  it("exposes the patterns as a list of regular expressions", () => {
    expect(GENERIC_SPEAKER_NAMES.length).toBeGreaterThan(0)
    GENERIC_SPEAKER_NAMES.forEach((pattern) =>
      expect(pattern).toBeInstanceOf(RegExp),
    )
  })

  it.each([
    "Guest-1",
    "guest-12",
    "GUEST-1",
    "Guest_3",
    "Guest 4",
    "spk_0",
    "spk1",
    "SPK3",
    "Unknown",
    "unknown",
    "speaker",
    "speaker3",
    "Speaker 2",
    "Unknown speaker",
    "Unknown speaker 4",
    "  Guest-2  ",
    "3f2b6c1e-8a4d-4f0e-9b1a-2c3d4e5f6a7b",
  ])("%p is generic", (name) => {
    expect(isGenericSpeakerName(name)).toBe(true)
  })

  it.each([
    "Alice",
    "Guest",
    "Guest-1a",
    "spk",
    "bot",
    "Speaker Alice",
    "Unknown guest",
    "",
    "   ",
    null,
    undefined,
    42,
  ])("%p is not generic", (name) => {
    expect(isGenericSpeakerName(name)).toBe(false)
  })
})

describe("annotateLocutorDefined", () => {
  it("flags a provider tag as not defined and a real name as defined", () => {
    expect(annotateLocutorDefined({ locutor: "Guest-1" }).locutorDefined).toBe(
      false,
    )
    expect(annotateLocutorDefined({ locutor: "Alice" }).locutorDefined).toBe(
      true,
    )
  })

  it("leaves a caption without locutor untouched", () => {
    expect(annotateLocutorDefined({ locutor: null })).toEqual({ locutor: null })
    expect(annotateLocutorDefined({ locutor: "" })).toEqual({ locutor: "" })
    expect(annotateLocutorDefined({ text: "hi" })).toEqual({ text: "hi" })
  })

  it("ignores non-object messages", () => {
    expect(annotateLocutorDefined(null)).toBe(null)
    expect(annotateLocutorDefined("text")).toBe("text")
  })
})
