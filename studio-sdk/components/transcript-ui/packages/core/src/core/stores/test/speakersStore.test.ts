import { describe, expect, it } from "bun:test"
import { createSpeakersStore } from "../speakersStore"

function makeStore() {
  const events: string[] = []
  const store = createSpeakersStore((event) => events.push(event))
  return { store, events }
}

describe("speakersStore", () => {
  it("ensure stores the defined flag of a created speaker", () => {
    const { store } = makeStore()
    store.ensure("spk-1", "spk1", false)
    expect(store.all.get("spk-1")).toMatchObject({ name: "spk1", defined: false })
  })

  it("ensure leaves the flag absent when unknown (a real name)", () => {
    const { store } = makeStore()
    store.ensure("spk-1", "Marie")
    expect("defined" in store.all.get("spk-1")!).toBe(false)
  })

  it("update that only flips defined is not swallowed", () => {
    const { store, events } = makeStore()
    store.ensure("spk-1", "spk1", false)
    store.update("spk-1", { defined: true })
    expect(store.all.get("spk-1")?.defined).toBe(true)
    expect(events).toEqual(["speaker:add", "speaker:update"])
  })
})
