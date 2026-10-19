import { describe, expect, it } from "bun:test"
import { computeSpeakerDisplayName } from "../computeSpeakerDisplayName"

function t(key: string, params?: Record<string, string | number>): string {
  return params ? `${key}:${params.number}` : key
}

function placeholder(name: string) {
  return { name, defined: false }
}

describe("computeSpeakerDisplayName", () => {
  it("keeps the number of a diarization tag", () => {
    expect(computeSpeakerDisplayName(placeholder("spk2"), t)).toBe(
      "speaker.placeholderLabelNumbered:2",
    )
  })

  it("keeps the number of an unidentified speaker", () => {
    expect(computeSpeakerDisplayName(placeholder("Unknown speaker 3"), t)).toBe(
      "speaker.placeholderLabelNumbered:3",
    )
  })

  it("drops the leading zeros", () => {
    expect(computeSpeakerDisplayName(placeholder("speaker01"), t)).toBe(
      "speaker.placeholderLabelNumbered:1",
    )
  })

  it("falls back to an unnumbered label without a number", () => {
    expect(computeSpeakerDisplayName(placeholder("Unknown speaker"), t)).toBe(
      "speaker.placeholderLabel",
    )
    expect(
      computeSpeakerDisplayName(
        { name: undefined as unknown as string, defined: false },
        t,
      ),
    ).toBe("speaker.placeholderLabel")
  })

  it("returns the stored name of a defined speaker", () => {
    expect(computeSpeakerDisplayName({ name: "spk2", defined: true }, t)).toBe(
      "spk2",
    )
  })

  it("returns the stored name when the flag is missing (legacy data)", () => {
    expect(computeSpeakerDisplayName({ name: "spk2" }, t)).toBe("spk2")
  })
})
