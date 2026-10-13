import { describe, expect, it } from "bun:test"
import { createTranslationStore } from "../translationStore"

function makeStore() {
  return createTranslationStore(
    { id: "tr-1", languages: ["fr"], isSource: true, turns: [] },
    () => {},
    () => {},
  )
}

describe("translationStore — advanceLastModifiedAt", () => {
  it("moves forward only", () => {
    const store = makeStore()
    store.advanceLastModifiedAt(2000)
    store.advanceLastModifiedAt(1000)
    store.advanceLastModifiedAt(2000)
    expect(store.lastModifiedAt.value).toBe(2000)

    store.advanceLastModifiedAt(3000)
    expect(store.lastModifiedAt.value).toBe(3000)
  })

  it("ignores null and non-finite timestamps", () => {
    const store = makeStore()
    store.advanceLastModifiedAt(null)
    store.advanceLastModifiedAt(Number.NaN)
    expect(store.lastModifiedAt.value).toBeNull()

    store.advanceLastModifiedAt(1000)
    store.advanceLastModifiedAt(null)
    store.advanceLastModifiedAt(Number.POSITIVE_INFINITY)
    expect(store.lastModifiedAt.value).toBe(1000)
  })
})
