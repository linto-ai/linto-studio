import { describe, expect, it } from "bun:test"
import {
  DEFAULT_SUMMARY_CAPABILITIES,
  computeCanChat,
  computeSummaryCapabilities,
} from "../capabilities"

const TEXT_ONLY = { text: "edit", speakers: "edit" } as const

describe("computeSummaryCapabilities", () => {
  it("falls back on the defaults when the host sets none", () => {
    expect(computeSummaryCapabilities(TEXT_ONLY)).toBe(
      DEFAULT_SUMMARY_CAPABILITIES,
    )
  })

  it("returns the host's permissions", () => {
    const summary = { generate: true, edit: false, forceGenerate: true }
    expect(computeSummaryCapabilities({ ...TEXT_ONLY, summary })).toBe(summary)
  })
})

describe("computeCanChat", () => {
  it("keeps the chat when the host sets nothing", () => {
    expect(computeCanChat(TEXT_ONLY)).toBe(true)
  })

  it("follows the host's capability", () => {
    expect(computeCanChat({ ...TEXT_ONLY, chat: "disabled" })).toBe(false)
    expect(computeCanChat({ ...TEXT_ONLY, chat: "enabled" })).toBe(true)
  })
})
