/**
 * The entitlements apidoc is the contract handed to the external system
 * (docs-twake/openapi-entitlements.yaml is generated from it): every `features`
 * schema must carry the same vocabulary, `recording` included (ADR 061), and
 * the exchange must know which of these keys LinTO serves.
 */
jest.mock("debug", () => () => () => {})
// resolve.js reaches the model registry lazily; keep Mongo out of this test.
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))

const fs = require("fs")
const path = require("path")

const { LINTO_FEATURES } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)

const apidoc = JSON.parse(
  fs.readFileSync(
    path.join(
      process.cwd(),
      "components/WebServer/apidoc/api/organizations/entitlements.json",
    ),
    "utf8",
  ),
)

function featureSchemas(node, found = []) {
  if (!node || typeof node !== "object") return found
  if (
    node.features &&
    typeof node.features === "object" &&
    node.features.properties
  ) {
    found.push(node.features.properties)
  }
  for (const value of Object.values(node)) featureSchemas(value, found)
  return found
}

const VOCABULARY = ["transcription", "summary", "translation", "recording"]

describe("entitlements apidoc", () => {
  const schemas = featureSchemas(apidoc)

  test("every features schema carries the whole vocabulary, recording included", () => {
    expect(schemas.length).toBeGreaterThanOrEqual(6)
    for (const properties of schemas) {
      expect(Object.keys(properties).sort()).toEqual([...VOCABULARY].sort())
      expect(properties.recording.type).toBe("boolean")
      expect(properties.transcription.properties.live.type).toBe("boolean")
      expect(properties.transcription.properties.async.type).toBe("boolean")
    }
  })

  test("recording is documented as a non-LinTO feature", () => {
    for (const properties of schemas) {
      expect(properties.recording.description).toMatch(/no LinTO right/)
    }
    expect(LINTO_FEATURES).not.toContain("recording")
  })
})
