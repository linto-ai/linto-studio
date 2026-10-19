const {
  computeSpeakerDisplayName,
} = require(`${process.cwd()}/lib/utility/computeSpeakerDisplayName`)

describe("computeSpeakerDisplayName", () => {
  test("a defined speaker keeps its stored name", () => {
    expect(
      computeSpeakerDisplayName({ speaker_name: "spk2", defined: true }, "fr-FR"),
    ).toBe("spk2")
  })

  test("a speaker without the flag (legacy data) keeps its stored name", () => {
    expect(computeSpeakerDisplayName({ speaker_name: "speaker3" }, "fr-FR")).toBe(
      "speaker3",
    )
  })

  test("a placeholder is labelled in the interface language with its number", () => {
    const spk = { speaker_name: "spk2", defined: false }
    expect(computeSpeakerDisplayName(spk, "fr-FR")).toBe("Intervenant 2")
    expect(computeSpeakerDisplayName(spk, "en-US")).toBe("Speaker 2")
    expect(computeSpeakerDisplayName(spk, "fr")).toBe("Intervenant 2")
  })

  test("the number drops leading zeros and tolerates trailing spaces", () => {
    expect(
      computeSpeakerDisplayName({ speaker_name: "spk02", defined: false }, "en"),
    ).toBe("Speaker 2")
    expect(
      computeSpeakerDisplayName(
        { speaker_name: "Unknown speaker 12 ", defined: false },
        "fr-FR",
      ),
    ).toBe("Intervenant 12")
  })

  test("a placeholder without a number gets the bare label", () => {
    expect(
      computeSpeakerDisplayName({ speaker_name: "speaker", defined: false }, "fr-FR"),
    ).toBe("Intervenant")
    expect(
      computeSpeakerDisplayName(
        { speaker_name: "Unknown speaker", defined: false },
        "en-US",
      ),
    ).toBe("Speaker")
  })

  test("an unknown or missing locale falls back to English", () => {
    const spk = { speaker_name: "spk1", defined: false }
    expect(computeSpeakerDisplayName(spk, "de-DE")).toBe("Speaker 1")
    expect(computeSpeakerDisplayName(spk, undefined)).toBe("Speaker 1")
    expect(computeSpeakerDisplayName(spk, "")).toBe("Speaker 1")
  })
})
