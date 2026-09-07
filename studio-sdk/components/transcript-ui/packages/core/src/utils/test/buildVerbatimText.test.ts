import { describe, expect, it } from "bun:test"
import { buildVerbatimText, type VerbatimTextTurn } from "../buildVerbatimText"

function makeTurn(partial: Partial<VerbatimTextTurn>): VerbatimTextTurn {
  return {
    speakerName: "",
    time: null,
    languageName: null,
    text: "",
    ...partial,
  }
}

describe("buildVerbatimText", () => {
  it("starts with the title followed by a blank line before the first turn", () => {
    const result = buildVerbatimText("Réunion projet X", [
      makeTurn({ text: "Bonjour" }),
    ])
    expect(result).toStartWith("Réunion projet X\n\nBonjour")
  })

  it("omits the title block when there is none", () => {
    const result = buildVerbatimText("", [makeTurn({ text: "Bonjour" })])
    expect(result).not.toStartWith("\n")
  })

  it("joins the present meta fields with a middle dot, skipping missing ones", () => {
    const result = buildVerbatimText("", [
      makeTurn({ speakerName: "Marie", time: "00:12", text: "Salut" }),
    ])
    expect(result).toContain("Marie · 00:12\nSalut")
  })

  it("drops the meta line entirely when nothing resolved", () => {
    const result = buildVerbatimText("", [makeTurn({ text: "Texte seul" })])
    expect(result).toBe("Texte seul\n")
  })

  it("renders one block per turn, in order", () => {
    const result = buildVerbatimText("", [
      makeTurn({ speakerName: "Marie", text: "Bonjour" }),
      makeTurn({ speakerName: "Thomas", text: "Salut" }),
    ])
    expect(result).toBe("Marie\nBonjour\n\nThomas\nSalut\n")
  })
})
