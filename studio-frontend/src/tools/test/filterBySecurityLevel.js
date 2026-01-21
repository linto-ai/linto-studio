import test from "ava"
import {
  filterBySecurityLevel,
  filterByMetaSecurityLevel,
  meetsSecurityLevel,
  meetsMetaSecurityLevel,
  normalizeSecurityLevel,
} from "../filterBySecurityLevel.js"

// ============================================
// normalizeSecurityLevel tests
// ============================================

test("normalizeSecurityLevel() returns 0 for integer 0", (t) => {
  t.is(normalizeSecurityLevel(0), 0)
})

test("normalizeSecurityLevel() returns 1 for integer 1", (t) => {
  t.is(normalizeSecurityLevel(1), 1)
})

test("normalizeSecurityLevel() returns 2 for integer 2", (t) => {
  t.is(normalizeSecurityLevel(2), 2)
})

test("normalizeSecurityLevel() returns 0 (default) for invalid string values", (t) => {
  t.is(normalizeSecurityLevel("insecure"), 0)
  t.is(normalizeSecurityLevel("sensitive"), 0)
  t.is(normalizeSecurityLevel("secure"), 0)
  t.is(normalizeSecurityLevel("unknown"), 0)
})

test("normalizeSecurityLevel() returns 0 for null", (t) => {
  t.is(normalizeSecurityLevel(null), 0)
})

test("normalizeSecurityLevel() returns 0 for undefined", (t) => {
  t.is(normalizeSecurityLevel(undefined), 0)
})

test("normalizeSecurityLevel() returns 0 for invalid integer values", (t) => {
  t.is(normalizeSecurityLevel(99), 0)
  t.is(normalizeSecurityLevel(-1), 0)
  t.is(normalizeSecurityLevel(3), 0)
})

// ============================================
// filterBySecurityLevel tests
// ============================================

test("filterBySecurityLevel() returns all items when required level is 0", (t) => {
  const items = [
    { name: "item1", security_level: 0 },
    { name: "item2", security_level: 1 },
    { name: "item3", security_level: 2 },
  ]
  const result = filterBySecurityLevel(items, 0)
  t.deepEqual(result, items)
})

test("filterBySecurityLevel() filters out level 0 items when required level is 1", (t) => {
  const items = [
    { name: "item1", security_level: 0 },
    { name: "item2", security_level: 1 },
    { name: "item3", security_level: 2 },
  ]
  const result = filterBySecurityLevel(items, 1)
  t.deepEqual(result, [
    { name: "item2", security_level: 1 },
    { name: "item3", security_level: 2 },
  ])
})

test("filterBySecurityLevel() returns only level 2 items when required level is 2", (t) => {
  const items = [
    { name: "item1", security_level: 0 },
    { name: "item2", security_level: 1 },
    { name: "item3", security_level: 2 },
  ]
  const result = filterBySecurityLevel(items, 2)
  t.deepEqual(result, [{ name: "item3", security_level: 2 }])
})

test("filterBySecurityLevel() treats invalid security_level values as 0 (default)", (t) => {
  const items = [
    { name: "item1", security_level: "insecure" },
    { name: "item2", security_level: 1 },
    { name: "item3", security_level: 2 },
  ]
  const result = filterBySecurityLevel(items, 1)
  t.deepEqual(result, [
    { name: "item2", security_level: 1 },
    { name: "item3", security_level: 2 },
  ])
})

test("filterBySecurityLevel() treats missing security_level as 0", (t) => {
  const items = [
    { name: "item1" },
    { name: "item2", security_level: 1 },
  ]
  const result = filterBySecurityLevel(items, 1)
  t.deepEqual(result, [{ name: "item2", security_level: 1 }])
})

test("filterBySecurityLevel() uses custom securityKey", (t) => {
  const items = [
    { name: "item1", level: 0 },
    { name: "item2", level: 2 },
  ]
  const result = filterBySecurityLevel(items, 2, "level")
  t.deepEqual(result, [{ name: "item2", level: 2 }])
})

test("filterBySecurityLevel() returns empty array when no items match", (t) => {
  const items = [
    { name: "item1", security_level: 0 },
    { name: "item2", security_level: 0 },
  ]
  const result = filterBySecurityLevel(items, 2)
  t.deepEqual(result, [])
})

test("filterBySecurityLevel() returns empty array for empty input", (t) => {
  const result = filterBySecurityLevel([], 2)
  t.deepEqual(result, [])
})

test("filterBySecurityLevel() treats invalid required level as 0 (default)", (t) => {
  const items = [
    { name: "item1", security_level: 0 },
    { name: "item2", security_level: 2 },
  ]
  const result = filterBySecurityLevel(items, "unknown")
  t.deepEqual(result, items)
})

// ============================================
// filterByMetaSecurityLevel tests
// ============================================

test("filterByMetaSecurityLevel() reads security level from meta.securityLevel", (t) => {
  const items = [
    { name: "profile1", meta: { securityLevel: 0 } },
    { name: "profile2", meta: { securityLevel: 1 } },
    { name: "profile3", meta: { securityLevel: 2 } },
  ]
  const result = filterByMetaSecurityLevel(items, 1)
  t.deepEqual(result, [
    { name: "profile2", meta: { securityLevel: 1 } },
    { name: "profile3", meta: { securityLevel: 2 } },
  ])
})

test("filterByMetaSecurityLevel() treats invalid meta.securityLevel as 0 (default)", (t) => {
  const items = [
    { name: "profile1", meta: { securityLevel: "insecure" } },
    { name: "profile2", meta: { securityLevel: 1 } },
    { name: "profile3", meta: { securityLevel: 2 } },
  ]
  const result = filterByMetaSecurityLevel(items, 1)
  t.deepEqual(result, [
    { name: "profile2", meta: { securityLevel: 1 } },
    { name: "profile3", meta: { securityLevel: 2 } },
  ])
})

test("filterByMetaSecurityLevel() treats missing meta as 0", (t) => {
  const items = [
    { name: "profile1" },
    { name: "profile2", meta: { securityLevel: 2 } },
  ]
  const result = filterByMetaSecurityLevel(items, 1)
  t.deepEqual(result, [{ name: "profile2", meta: { securityLevel: 2 } }])
})

test("filterByMetaSecurityLevel() treats missing meta.securityLevel as 0", (t) => {
  const items = [
    { name: "profile1", meta: {} },
    { name: "profile2", meta: { securityLevel: 2 } },
  ]
  const result = filterByMetaSecurityLevel(items, 1)
  t.deepEqual(result, [{ name: "profile2", meta: { securityLevel: 2 } }])
})

// ============================================
// meetsSecurityLevel tests
// ============================================

test("meetsSecurityLevel() returns true when item level equals required level", (t) => {
  const item = { security_level: 1 }
  t.true(meetsSecurityLevel(item, 1))
})

test("meetsSecurityLevel() returns true when item level exceeds required level", (t) => {
  const item = { security_level: 2 }
  t.true(meetsSecurityLevel(item, 1))
})

test("meetsSecurityLevel() returns false when item level is below required level", (t) => {
  const item = { security_level: 0 }
  t.false(meetsSecurityLevel(item, 1))
})

test("meetsSecurityLevel() treats invalid item level as 0 (default)", (t) => {
  const item = { security_level: "insecure" }
  t.true(meetsSecurityLevel(item, 0))
  t.false(meetsSecurityLevel(item, 1))
})

test("meetsSecurityLevel() returns false for null item", (t) => {
  t.false(meetsSecurityLevel(null, 0))
})

test("meetsSecurityLevel() returns false for undefined item", (t) => {
  t.false(meetsSecurityLevel(undefined, 0))
})

test("meetsSecurityLevel() uses custom securityKey", (t) => {
  const item = { level: 2 }
  t.true(meetsSecurityLevel(item, 2, "level"))
})

test("meetsSecurityLevel() treats missing security level as 0", (t) => {
  const item = { name: "test" }
  t.true(meetsSecurityLevel(item, 0))
  t.false(meetsSecurityLevel(item, 1))
})

// ============================================
// meetsMetaSecurityLevel tests
// ============================================

test("meetsMetaSecurityLevel() returns true when meta.securityLevel equals required level", (t) => {
  const item = { meta: { securityLevel: 1 } }
  t.true(meetsMetaSecurityLevel(item, 1))
})

test("meetsMetaSecurityLevel() returns true when meta.securityLevel exceeds required level", (t) => {
  const item = { meta: { securityLevel: 2 } }
  t.true(meetsMetaSecurityLevel(item, 1))
})

test("meetsMetaSecurityLevel() returns false when meta.securityLevel is below required level", (t) => {
  const item = { meta: { securityLevel: 0 } }
  t.false(meetsMetaSecurityLevel(item, 1))
})

test("meetsMetaSecurityLevel() treats invalid meta.securityLevel as 0 (default)", (t) => {
  const item = { meta: { securityLevel: "insecure" } }
  t.true(meetsMetaSecurityLevel(item, 0))
  t.false(meetsMetaSecurityLevel(item, 1))
})

test("meetsMetaSecurityLevel() returns false for null item", (t) => {
  t.false(meetsMetaSecurityLevel(null, 0))
})

test("meetsMetaSecurityLevel() returns false for undefined item", (t) => {
  t.false(meetsMetaSecurityLevel(undefined, 0))
})

test("meetsMetaSecurityLevel() treats missing meta as 0", (t) => {
  const item = { name: "test" }
  t.true(meetsMetaSecurityLevel(item, 0))
  t.false(meetsMetaSecurityLevel(item, 1))
})

test("meetsMetaSecurityLevel() treats missing meta.securityLevel as 0", (t) => {
  const item = { meta: {} }
  t.true(meetsMetaSecurityLevel(item, 0))
  t.false(meetsMetaSecurityLevel(item, 1))
})

// ============================================
// Security hierarchy validation tests
// ============================================

test("security hierarchy: 0 < 1 < 2", (t) => {
  const level0Item = { security_level: 0 }
  const level1Item = { security_level: 1 }
  const level2Item = { security_level: 2 }

  // level 0 only meets level 0
  t.true(meetsSecurityLevel(level0Item, 0))
  t.false(meetsSecurityLevel(level0Item, 1))
  t.false(meetsSecurityLevel(level0Item, 2))

  // level 1 meets 0 and 1
  t.true(meetsSecurityLevel(level1Item, 0))
  t.true(meetsSecurityLevel(level1Item, 1))
  t.false(meetsSecurityLevel(level1Item, 2))

  // level 2 meets all levels
  t.true(meetsSecurityLevel(level2Item, 0))
  t.true(meetsSecurityLevel(level2Item, 1))
  t.true(meetsSecurityLevel(level2Item, 2))
})
