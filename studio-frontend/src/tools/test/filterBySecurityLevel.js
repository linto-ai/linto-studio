import test from "ava"
import {
  filterBySecurityLevel,
  filterByMetaSecurityLevel,
  meetsSecurityLevel,
  meetsMetaSecurityLevel,
} from "../filterBySecurityLevel.js"

// ============================================
// filterBySecurityLevel tests
// ============================================

test("filterBySecurityLevel() returns all items when required level is insecure", (t) => {
  const items = [
    { name: "item1", security_level: "insecure" },
    { name: "item2", security_level: "sensitive" },
    { name: "item3", security_level: "secure" },
  ]
  const result = filterBySecurityLevel(items, "insecure")
  t.is(result.length, 3)
})

test("filterBySecurityLevel() filters out insecure items when required level is sensitive", (t) => {
  const items = [
    { name: "item1", security_level: "insecure" },
    { name: "item2", security_level: "sensitive" },
    { name: "item3", security_level: "secure" },
  ]
  const result = filterBySecurityLevel(items, "sensitive")
  t.is(result.length, 2)
  t.true(result.every((item) => item.security_level !== "insecure"))
})

test("filterBySecurityLevel() returns only secure items when required level is secure", (t) => {
  const items = [
    { name: "item1", security_level: "insecure" },
    { name: "item2", security_level: "sensitive" },
    { name: "item3", security_level: "secure" },
  ]
  const result = filterBySecurityLevel(items, "secure")
  t.is(result.length, 1)
  t.is(result[0].security_level, "secure")
})

test("filterBySecurityLevel() treats missing security_level as insecure", (t) => {
  const items = [
    { name: "item1" },
    { name: "item2", security_level: "sensitive" },
  ]
  const result = filterBySecurityLevel(items, "sensitive")
  t.is(result.length, 1)
  t.is(result[0].name, "item2")
})

test("filterBySecurityLevel() uses custom securityKey", (t) => {
  const items = [
    { name: "item1", level: "insecure" },
    { name: "item2", level: "secure" },
  ]
  const result = filterBySecurityLevel(items, "secure", "level")
  t.is(result.length, 1)
  t.is(result[0].name, "item2")
})

test("filterBySecurityLevel() returns empty array when no items match", (t) => {
  const items = [
    { name: "item1", security_level: "insecure" },
    { name: "item2", security_level: "insecure" },
  ]
  const result = filterBySecurityLevel(items, "secure")
  t.deepEqual(result, [])
})

test("filterBySecurityLevel() returns empty array for empty input", (t) => {
  const result = filterBySecurityLevel([], "secure")
  t.deepEqual(result, [])
})

test("filterBySecurityLevel() treats unknown required level as insecure (level 1)", (t) => {
  const items = [
    { name: "item1", security_level: "insecure" },
    { name: "item2", security_level: "secure" },
  ]
  const result = filterBySecurityLevel(items, "unknown")
  t.is(result.length, 2)
})

// ============================================
// filterByMetaSecurityLevel tests
// ============================================

test("filterByMetaSecurityLevel() reads security level from meta.securityLevel", (t) => {
  const items = [
    { name: "profile1", meta: { securityLevel: "insecure" } },
    { name: "profile2", meta: { securityLevel: "sensitive" } },
    { name: "profile3", meta: { securityLevel: "secure" } },
  ]
  const result = filterByMetaSecurityLevel(items, "sensitive")
  t.is(result.length, 2)
  t.true(result.every((item) => item.meta.securityLevel !== "insecure"))
})

test("filterByMetaSecurityLevel() treats missing meta as insecure", (t) => {
  const items = [
    { name: "profile1" },
    { name: "profile2", meta: { securityLevel: "secure" } },
  ]
  const result = filterByMetaSecurityLevel(items, "sensitive")
  t.is(result.length, 1)
  t.is(result[0].name, "profile2")
})

test("filterByMetaSecurityLevel() treats missing meta.securityLevel as insecure", (t) => {
  const items = [
    { name: "profile1", meta: {} },
    { name: "profile2", meta: { securityLevel: "secure" } },
  ]
  const result = filterByMetaSecurityLevel(items, "sensitive")
  t.is(result.length, 1)
  t.is(result[0].name, "profile2")
})

// ============================================
// meetsSecurityLevel tests
// ============================================

test("meetsSecurityLevel() returns true when item level equals required level", (t) => {
  const item = { security_level: "sensitive" }
  t.true(meetsSecurityLevel(item, "sensitive"))
})

test("meetsSecurityLevel() returns true when item level exceeds required level", (t) => {
  const item = { security_level: "secure" }
  t.true(meetsSecurityLevel(item, "sensitive"))
})

test("meetsSecurityLevel() returns false when item level is below required level", (t) => {
  const item = { security_level: "insecure" }
  t.false(meetsSecurityLevel(item, "sensitive"))
})

test("meetsSecurityLevel() returns false for null item", (t) => {
  t.false(meetsSecurityLevel(null, "insecure"))
})

test("meetsSecurityLevel() returns false for undefined item", (t) => {
  t.false(meetsSecurityLevel(undefined, "insecure"))
})

test("meetsSecurityLevel() uses custom securityKey", (t) => {
  const item = { level: "secure" }
  t.true(meetsSecurityLevel(item, "secure", "level"))
})

test("meetsSecurityLevel() treats missing security level as insecure", (t) => {
  const item = { name: "test" }
  t.true(meetsSecurityLevel(item, "insecure"))
  t.false(meetsSecurityLevel(item, "sensitive"))
})

// ============================================
// meetsMetaSecurityLevel tests
// ============================================

test("meetsMetaSecurityLevel() returns true when meta.securityLevel equals required level", (t) => {
  const item = { meta: { securityLevel: "sensitive" } }
  t.true(meetsMetaSecurityLevel(item, "sensitive"))
})

test("meetsMetaSecurityLevel() returns true when meta.securityLevel exceeds required level", (t) => {
  const item = { meta: { securityLevel: "secure" } }
  t.true(meetsMetaSecurityLevel(item, "sensitive"))
})

test("meetsMetaSecurityLevel() returns false when meta.securityLevel is below required level", (t) => {
  const item = { meta: { securityLevel: "insecure" } }
  t.false(meetsMetaSecurityLevel(item, "sensitive"))
})

test("meetsMetaSecurityLevel() returns false for null item", (t) => {
  t.false(meetsMetaSecurityLevel(null, "insecure"))
})

test("meetsMetaSecurityLevel() returns false for undefined item", (t) => {
  t.false(meetsMetaSecurityLevel(undefined, "insecure"))
})

test("meetsMetaSecurityLevel() treats missing meta as insecure", (t) => {
  const item = { name: "test" }
  t.true(meetsMetaSecurityLevel(item, "insecure"))
  t.false(meetsMetaSecurityLevel(item, "sensitive"))
})

test("meetsMetaSecurityLevel() treats missing meta.securityLevel as insecure", (t) => {
  const item = { meta: {} }
  t.true(meetsMetaSecurityLevel(item, "insecure"))
  t.false(meetsMetaSecurityLevel(item, "sensitive"))
})

// ============================================
// Security hierarchy validation tests
// ============================================

test("security hierarchy: insecure < sensitive < secure", (t) => {
  const insecureItem = { security_level: "insecure" }
  const sensitiveItem = { security_level: "sensitive" }
  const secureItem = { security_level: "secure" }

  // insecure only meets insecure
  t.true(meetsSecurityLevel(insecureItem, "insecure"))
  t.false(meetsSecurityLevel(insecureItem, "sensitive"))
  t.false(meetsSecurityLevel(insecureItem, "secure"))

  // sensitive meets insecure and sensitive
  t.true(meetsSecurityLevel(sensitiveItem, "insecure"))
  t.true(meetsSecurityLevel(sensitiveItem, "sensitive"))
  t.false(meetsSecurityLevel(sensitiveItem, "secure"))

  // secure meets all levels
  t.true(meetsSecurityLevel(secureItem, "insecure"))
  t.true(meetsSecurityLevel(secureItem, "sensitive"))
  t.true(meetsSecurityLevel(secureItem, "secure"))
})
