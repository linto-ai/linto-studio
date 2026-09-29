import { describe, expect, it } from "bun:test"
import { computeSessionOptions } from "../computeSessionOptions"

const sessions = [
  { id: "s1", title: "Résumé de la réunion" },
  { id: "s2", title: "Questions sur le budget" },
]

describe("computeSessionOptions", () => {
  it("lists the sessions as they are when the active one is among them", () => {
    expect(computeSessionOptions(sessions, "s2", "Nouvelle conversation")).toEqual([
      { value: "s1", label: "Résumé de la réunion" },
      { value: "s2", label: "Questions sur le budget" },
    ])
  })

  it("adds a placeholder entry first when no session is active", () => {
    expect(computeSessionOptions(sessions, null, "Nouvelle conversation")).toEqual([
      { value: "", label: "Nouvelle conversation" },
      { value: "s1", label: "Résumé de la réunion" },
      { value: "s2", label: "Questions sur le budget" },
    ])
  })

  it("gives an active session missing from the list its own entry", () => {
    expect(computeSessionOptions(sessions, "s3", "Nouvelle conversation")[0]).toEqual({
      value: "s3",
      label: "Nouvelle conversation",
    })
  })

  it("labels untitled sessions with the new-session label", () => {
    expect(
      computeSessionOptions([{ id: "s1", title: "" }], "s1", "Nouvelle conversation"),
    ).toEqual([{ value: "s1", label: "Nouvelle conversation" }])
  })

  it("still has one entry with no session at all", () => {
    expect(computeSessionOptions([], null, "Nouvelle conversation")).toEqual([
      { value: "", label: "Nouvelle conversation" },
    ])
  })
})
