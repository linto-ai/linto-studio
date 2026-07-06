const Y = require("yjs")
const {
  attachTurnIdMinter,
} = require(`${process.cwd()}/components/EditorHandler/turnIds`)

function makeTurn(text, id) {
  const el = new Y.XmlElement("turn")
  if (id) el.setAttribute("id", id)
  const t = new Y.XmlText()
  t.insert(0, text)
  el.insert(0, [t])
  return el
}

function flushMicrotasks() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe("attachTurnIdMinter", () => {
  test("mints an id for a turn inserted without one", async () => {
    const doc = new Y.Doc()
    const fragment = doc.getXmlFragment("default")
    fragment.insert(0, [makeTurn("bonjour", "turn-1")])
    const detach = attachTurnIdMinter(fragment)

    fragment.insert(1, [makeTurn("tout le monde")])
    await flushMicrotasks()

    const ids = fragment.toArray().map((el) => el.getAttribute("id"))
    expect(ids[0]).toBe("turn-1")
    expect(ids[1]).toBeTruthy()
    expect(ids[1]).not.toBe("turn-1")
    detach()
  })

  test("repairs a duplicated id (pasted turn), keeping the first", async () => {
    const doc = new Y.Doc()
    const fragment = doc.getXmlFragment("default")
    fragment.insert(0, [makeTurn("original", "dup")])
    const detach = attachTurnIdMinter(fragment)

    fragment.insert(1, [makeTurn("copy", "dup")])
    await flushMicrotasks()

    const ids = fragment.toArray().map((el) => el.getAttribute("id"))
    expect(ids[0]).toBe("dup")
    expect(ids[1]).toBeTruthy()
    expect(ids[1]).not.toBe("dup")
    detach()
  })

  test("repairs at attach time and stays quiet on text edits", async () => {
    const doc = new Y.Doc()
    const fragment = doc.getXmlFragment("default")
    fragment.insert(0, [makeTurn("sans id")])
    const detach = attachTurnIdMinter(fragment)
    // Attach-time repair is synchronous.
    const id = fragment.get(0).getAttribute("id")
    expect(id).toBeTruthy()

    // A text edit inside the turn must not re-mint.
    fragment.get(0).get(0).insert(0, "x")
    await flushMicrotasks()
    expect(fragment.get(0).getAttribute("id")).toBe(id)
    detach()
  })
})
