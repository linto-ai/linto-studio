import test from "ava"
import { RegenerationsInFlight } from "../RegenerationsInFlight.js"

test("RegenerationsInFlight keeps the requests of each track apart", (t) => {
  const regenerations = new RegenerationsInFlight()
  regenerations.add("track-a", "cr")
  regenerations.add("track-b", "summary")
  t.true(regenerations.has("track-a", "cr"))
  t.false(regenerations.has("track-a", "summary"))
  t.deepEqual(regenerations.list("track-b"), ["summary"])
})

test("RegenerationsInFlight forgets a request once answered", (t) => {
  const regenerations = new RegenerationsInFlight()
  regenerations.add("track-a", "cr")
  regenerations.delete("track-a", "cr")
  t.false(regenerations.has("track-a", "cr"))
  t.deepEqual(regenerations.list("track-a"), [])
})

test("RegenerationsInFlight knows nothing of an unseen track", (t) => {
  const regenerations = new RegenerationsInFlight()
  t.false(regenerations.has("track-z", "cr"))
  t.deepEqual(regenerations.list("track-z"), [])
  regenerations.delete("track-z", "cr")
})
