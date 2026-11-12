import test from "ava"
import { addRecentInstance } from "../addRecentInstance.js"

const DEFAULT = "https://studio.linto.ai"

function instance(address) {
  return { address, base: address }
}

test("addRecentInstance() moves the used instance first", (t) => {
  const recents = [instance("https://a.fr"), instance("https://b.fr")]
  const updated = addRecentInstance(recents, instance("https://b.fr"), DEFAULT)
  t.deepEqual(
    updated.map((item) => item.address),
    ["https://b.fr", "https://a.fr"],
  )
})

test("addRecentInstance() keeps three entries", (t) => {
  const recents = ["a", "b", "c"].map((name) => instance(`https://${name}.fr`))
  const updated = addRecentInstance(recents, instance("https://d.fr"), DEFAULT)
  t.deepEqual(
    updated.map((item) => item.address),
    ["https://d.fr", "https://a.fr", "https://b.fr"],
  )
})

test("addRecentInstance() never lists the default instance", (t) => {
  const recents = [instance("https://a.fr")]
  t.deepEqual(addRecentInstance(recents, instance(DEFAULT), DEFAULT), recents)
})
