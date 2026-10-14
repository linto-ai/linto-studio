import test from "ava"
import { buildReportCatalogEntry } from "../buildReportCatalogEntry.js"

const service = {
  id: "uuid-1",
  name: "summary",
  route: "cr",
  format: "cr-format",
  description: { fr: "Compte rendu", en: "Report" },
  flavors: [{ name: "short" }, { name: "long", is_default: true }],
}

test("buildReportCatalogEntry() keeps what the gateway calls need", (t) => {
  t.deepEqual(buildReportCatalogEntry(service, "fr-FR"), {
    id: "cr",
    label: "Compte rendu",
    serviceId: "uuid-1",
    format: "cr-format",
    route: "cr",
    flavor: "long",
  })
})

test("buildReportCatalogEntry() falls back on the name and the first flavor", (t) => {
  const entry = buildReportCatalogEntry(
    { name: "summary", flavors: [{ name: "short" }] },
    "en-US",
  )
  t.deepEqual(entry, {
    id: "summary",
    label: "summary",
    serviceId: null,
    format: "summary",
    route: "summary",
    flavor: "short",
  })
})

test("buildReportCatalogEntry() has no flavor without flavors", (t) => {
  t.is(buildReportCatalogEntry({ name: "summary" }, "en-US").flavor, null)
})
