import { describe, expect, it } from "bun:test"
import { parseWatermark } from "../parseWatermark"

const tokens = {
  linto: { src: "/img/linto.svg", alt: "LinTO" },
  logo: { src: "/img/logo.png" },
}

describe("parseWatermark", () => {
  it("returns a single text part for plain content", () => {
    expect(parseWatermark("Hello world", tokens)).toEqual([
      { type: "text", value: "Hello world" },
    ])
  })

  it("returns an empty array for empty content", () => {
    expect(parseWatermark("", tokens)).toEqual([])
  })

  it("replaces a known token with an image part", () => {
    expect(parseWatermark("$linto", tokens)).toEqual([
      { type: "token", src: "/img/linto.svg", alt: "LinTO" },
    ])
  })

  it("uses the token name as alt when alt is not provided", () => {
    expect(parseWatermark("$logo", tokens)).toEqual([
      { type: "token", src: "/img/logo.png", alt: "logo" },
    ])
  })

  it("keeps unknown tokens as literal text", () => {
    expect(parseWatermark("Hi $unknown", tokens)).toEqual([
      { type: "text", value: "Hi " },
      { type: "text", value: "$unknown" },
    ])
  })

  it("handles text around and between tokens", () => {
    expect(
      parseWatermark("Powered by $linto and $logo - thanks", tokens),
    ).toEqual([
      { type: "text", value: "Powered by " },
      { type: "token", src: "/img/linto.svg", alt: "LinTO" },
      { type: "text", value: " and " },
      { type: "token", src: "/img/logo.png", alt: "logo" },
      { type: "text", value: " - thanks" },
    ])
  })

  it("replaces every occurrence of the same token", () => {
    expect(parseWatermark("$linto vs $linto", tokens)).toEqual([
      { type: "token", src: "/img/linto.svg", alt: "LinTO" },
      { type: "text", value: " vs " },
      { type: "token", src: "/img/linto.svg", alt: "LinTO" },
    ])
  })

  it("stops the token name at the first non-word character", () => {
    expect(parseWatermark("$linto.svg", tokens)).toEqual([
      { type: "token", src: "/img/linto.svg", alt: "LinTO" },
      { type: "text", value: ".svg" },
    ])
  })

  it("handles adjacent tokens", () => {
    expect(parseWatermark("$linto$logo", tokens)).toEqual([
      { type: "token", src: "/img/linto.svg", alt: "LinTO" },
      { type: "token", src: "/img/logo.png", alt: "logo" },
    ])
  })

  it("keeps a lone $ as literal text", () => {
    expect(parseWatermark("price: $ 20", tokens)).toEqual([
      { type: "text", value: "price: $ 20" },
    ])
  })

  it("keeps numeric-only tokens as literal when unknown", () => {
    expect(parseWatermark("$20", tokens)).toEqual([
      { type: "text", value: "$20" },
    ])
  })

  it("does not run HTML: angle brackets are kept as-is (rendering escapes them)", () => {
    expect(parseWatermark("<script>$linto", tokens)).toEqual([
      { type: "text", value: "<script>" },
      { type: "token", src: "/img/linto.svg", alt: "LinTO" },
    ])
  })

  it("works with no tokens registered", () => {
    expect(parseWatermark("$linto hi", {})).toEqual([
      { type: "text", value: "$linto" },
      { type: "text", value: " hi" },
    ])
  })

  it("is stateless across consecutive calls (no regex lastIndex leak)", () => {
    const first = parseWatermark("$linto", tokens)
    const second = parseWatermark("$linto", tokens)
    expect(first).toEqual(second)
  })
})
