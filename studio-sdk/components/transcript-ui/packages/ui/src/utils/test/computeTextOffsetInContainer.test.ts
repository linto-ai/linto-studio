import { describe, expect, it } from "bun:test"
import { computeTextOffsetInContainer } from "../computeTextOffsetInContainer"

// Minimal DOM-shaped stubs: the walk only reads nodeType, nodeValue and
// childNodes, so plain objects are enough (bun test has no DOM).
interface StubNode {
  nodeType: number
  nodeValue: string | null
  childNodes: StubNode[]
}

function text(value: string): StubNode {
  return { nodeType: 3, nodeValue: value, childNodes: [] }
}

function element(...children: StubNode[]): StubNode {
  return { nodeType: 1, nodeValue: null, childNodes: children }
}

function offset(container: StubNode, target: StubNode, local: number): number {
  return computeTextOffsetInContainer(
    container as unknown as Node,
    target as unknown as Node,
    local,
  )
}

describe("computeTextOffsetInContainer", () => {
  // Mirrors a read-view turn: <p><span>Bonjour</span> <span>tout</span> <span>le</span></p>
  const words = [text("Bonjour"), text("tout"), text("le")]
  const spans = words.map((w) => element(w))
  const container = element(spans[0]!, text(" "), spans[1]!, text(" "), spans[2]!)

  it("offsets inside the first text node are the local offset", () => {
    expect(offset(container, words[0]!, 3)).toBe(3)
  })

  it("offsets in later words include preceding words and separators", () => {
    // "Bonjour tout le" — "tout" starts at 8, "le" at 13
    expect(offset(container, words[1]!, 0)).toBe(8)
    expect(offset(container, words[1]!, 4)).toBe(12)
    expect(offset(container, words[2]!, 2)).toBe(15)
  })

  it("resolves an element position to the text before its Nth child", () => {
    // Caret "before child 2" of the container = before the second span
    expect(offset(container, container, 2)).toBe(8)
  })

  it("resolves an element position past the last child to the full length", () => {
    expect(offset(container, container, container.childNodes.length)).toBe(15)
  })
})
