import test from "ava"
import {
  filterBySecurityLevel,
  filterByMetaSecurityLevel,
  meetsSecurityLevel,
  meetsMetaSecurityLevel,
  normalizeSecurityLevel,
} from "../filterBySecurityLevel.js"
import {
  SECURITY_LEVEL_PUBLIC,
  SECURITY_LEVEL_COMMISSION,
  SECURITY_LEVEL_SENSITIVE,
} from "../../const/securityLevels.js"

// ============================================
// normalizeSecurityLevel tests
// ============================================

test("normalizeSecurityLevel() returns SECURITY_LEVEL_PUBLIC for integer 0", (t) => {
  t.is(normalizeSecurityLevel(SECURITY_LEVEL_PUBLIC), SECURITY_LEVEL_PUBLIC)
})

test("normalizeSecurityLevel() returns SECURITY_LEVEL_COMMISSION for integer 1", (t) => {
  t.is(normalizeSecurityLevel(SECURITY_LEVEL_COMMISSION), SECURITY_LEVEL_COMMISSION)
})

test("normalizeSecurityLevel() returns SECURITY_LEVEL_SENSITIVE for integer 2", (t) => {
  t.is(normalizeSecurityLevel(SECURITY_LEVEL_SENSITIVE), SECURITY_LEVEL_SENSITIVE)
})

test("normalizeSecurityLevel() returns SECURITY_LEVEL_PUBLIC (default) for invalid string values", (t) => {
  t.is(normalizeSecurityLevel("insecure"), SECURITY_LEVEL_PUBLIC)
  t.is(normalizeSecurityLevel("sensitive"), SECURITY_LEVEL_PUBLIC)
  t.is(normalizeSecurityLevel("secure"), SECURITY_LEVEL_PUBLIC)
  t.is(normalizeSecurityLevel("unknown"), SECURITY_LEVEL_PUBLIC)
})

test("normalizeSecurityLevel() returns SECURITY_LEVEL_PUBLIC for null", (t) => {
  t.is(normalizeSecurityLevel(null), SECURITY_LEVEL_PUBLIC)
})

test("normalizeSecurityLevel() returns SECURITY_LEVEL_PUBLIC for undefined", (t) => {
  t.is(normalizeSecurityLevel(undefined), SECURITY_LEVEL_PUBLIC)
})

test("normalizeSecurityLevel() returns SECURITY_LEVEL_PUBLIC for invalid integer values", (t) => {
  t.is(normalizeSecurityLevel(99), SECURITY_LEVEL_PUBLIC)
  t.is(normalizeSecurityLevel(-1), SECURITY_LEVEL_PUBLIC)
  t.is(normalizeSecurityLevel(3), SECURITY_LEVEL_PUBLIC)
})

// ============================================
// filterBySecurityLevel tests
// ============================================

test("filterBySecurityLevel() returns all items when required level is SECURITY_LEVEL_PUBLIC", (t) => {
  const items = [
    { name: "item1", security_level: SECURITY_LEVEL_PUBLIC },
    { name: "item2", security_level: SECURITY_LEVEL_COMMISSION },
    { name: "item3", security_level: SECURITY_LEVEL_SENSITIVE },
  ]
  const result = filterBySecurityLevel(items, SECURITY_LEVEL_PUBLIC)
  t.deepEqual(result, items)
})

test("filterBySecurityLevel() filters out level PUBLIC items when required level is SECURITY_LEVEL_COMMISSION", (t) => {
  const items = [
    { name: "item1", security_level: SECURITY_LEVEL_PUBLIC },
    { name: "item2", security_level: SECURITY_LEVEL_COMMISSION },
    { name: "item3", security_level: SECURITY_LEVEL_SENSITIVE },
  ]
  const result = filterBySecurityLevel(items, SECURITY_LEVEL_COMMISSION)
  t.deepEqual(result, [
    { name: "item2", security_level: SECURITY_LEVEL_COMMISSION },
    { name: "item3", security_level: SECURITY_LEVEL_SENSITIVE },
  ])
})

test("filterBySecurityLevel() returns only SECURITY_LEVEL_SENSITIVE items when required level is SECURITY_LEVEL_SENSITIVE", (t) => {
  const items = [
    { name: "item1", security_level: SECURITY_LEVEL_PUBLIC },
    { name: "item2", security_level: SECURITY_LEVEL_COMMISSION },
    { name: "item3", security_level: SECURITY_LEVEL_SENSITIVE },
  ]
  const result = filterBySecurityLevel(items, SECURITY_LEVEL_SENSITIVE)
  t.deepEqual(result, [{ name: "item3", security_level: SECURITY_LEVEL_SENSITIVE }])
})

test("filterBySecurityLevel() treats invalid security_level values as SECURITY_LEVEL_PUBLIC (default)", (t) => {
  const items = [
    { name: "item1", security_level: "insecure" },
    { name: "item2", security_level: SECURITY_LEVEL_COMMISSION },
    { name: "item3", security_level: SECURITY_LEVEL_SENSITIVE },
  ]
  const result = filterBySecurityLevel(items, SECURITY_LEVEL_COMMISSION)
  t.deepEqual(result, [
    { name: "item2", security_level: SECURITY_LEVEL_COMMISSION },
    { name: "item3", security_level: SECURITY_LEVEL_SENSITIVE },
  ])
})

test("filterBySecurityLevel() treats missing security_level as SECURITY_LEVEL_PUBLIC", (t) => {
  const items = [
    { name: "item1" },
    { name: "item2", security_level: SECURITY_LEVEL_COMMISSION },
  ]
  const result = filterBySecurityLevel(items, SECURITY_LEVEL_COMMISSION)
  t.deepEqual(result, [{ name: "item2", security_level: SECURITY_LEVEL_COMMISSION }])
})

test("filterBySecurityLevel() uses custom securityKey", (t) => {
  const items = [
    { name: "item1", level: SECURITY_LEVEL_PUBLIC },
    { name: "item2", level: SECURITY_LEVEL_SENSITIVE },
  ]
  const result = filterBySecurityLevel(items, SECURITY_LEVEL_SENSITIVE, "level")
  t.deepEqual(result, [{ name: "item2", level: SECURITY_LEVEL_SENSITIVE }])
})

test("filterBySecurityLevel() returns empty array when no items match", (t) => {
  const items = [
    { name: "item1", security_level: SECURITY_LEVEL_PUBLIC },
    { name: "item2", security_level: SECURITY_LEVEL_PUBLIC },
  ]
  const result = filterBySecurityLevel(items, SECURITY_LEVEL_SENSITIVE)
  t.deepEqual(result, [])
})

test("filterBySecurityLevel() returns empty array for empty input", (t) => {
  const result = filterBySecurityLevel([], SECURITY_LEVEL_SENSITIVE)
  t.deepEqual(result, [])
})

test("filterBySecurityLevel() treats invalid required level as SECURITY_LEVEL_PUBLIC (default)", (t) => {
  const items = [
    { name: "item1", security_level: SECURITY_LEVEL_PUBLIC },
    { name: "item2", security_level: SECURITY_LEVEL_SENSITIVE },
  ]
  const result = filterBySecurityLevel(items, "unknown")
  t.deepEqual(result, items)
})

// ============================================
// filterByMetaSecurityLevel tests
// ============================================

test("filterByMetaSecurityLevel() reads security level from meta.securityLevel", (t) => {
  const items = [
    { name: "profile1", meta: { securityLevel: SECURITY_LEVEL_PUBLIC } },
    { name: "profile2", meta: { securityLevel: SECURITY_LEVEL_COMMISSION } },
    { name: "profile3", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } },
  ]
  const result = filterByMetaSecurityLevel(items, SECURITY_LEVEL_COMMISSION)
  t.deepEqual(result, [
    { name: "profile2", meta: { securityLevel: SECURITY_LEVEL_COMMISSION } },
    { name: "profile3", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } },
  ])
})

test("filterByMetaSecurityLevel() treats invalid meta.securityLevel as SECURITY_LEVEL_PUBLIC (default)", (t) => {
  const items = [
    { name: "profile1", meta: { securityLevel: "insecure" } },
    { name: "profile2", meta: { securityLevel: SECURITY_LEVEL_COMMISSION } },
    { name: "profile3", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } },
  ]
  const result = filterByMetaSecurityLevel(items, SECURITY_LEVEL_COMMISSION)
  t.deepEqual(result, [
    { name: "profile2", meta: { securityLevel: SECURITY_LEVEL_COMMISSION } },
    { name: "profile3", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } },
  ])
})

test("filterByMetaSecurityLevel() treats missing meta as SECURITY_LEVEL_PUBLIC", (t) => {
  const items = [
    { name: "profile1" },
    { name: "profile2", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } },
  ]
  const result = filterByMetaSecurityLevel(items, SECURITY_LEVEL_COMMISSION)
  t.deepEqual(result, [{ name: "profile2", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } }])
})

test("filterByMetaSecurityLevel() treats missing meta.securityLevel as SECURITY_LEVEL_PUBLIC", (t) => {
  const items = [
    { name: "profile1", meta: {} },
    { name: "profile2", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } },
  ]
  const result = filterByMetaSecurityLevel(items, SECURITY_LEVEL_COMMISSION)
  t.deepEqual(result, [{ name: "profile2", meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } }])
})

// ============================================
// meetsSecurityLevel tests
// ============================================

test("meetsSecurityLevel() returns true when item level equals required level", (t) => {
  const item = { security_level: SECURITY_LEVEL_COMMISSION }
  t.true(meetsSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsSecurityLevel() returns true when item level exceeds required level", (t) => {
  const item = { security_level: SECURITY_LEVEL_SENSITIVE }
  t.true(meetsSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsSecurityLevel() returns false when item level is below required level", (t) => {
  const item = { security_level: SECURITY_LEVEL_PUBLIC }
  t.false(meetsSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsSecurityLevel() treats invalid item level as SECURITY_LEVEL_PUBLIC (default)", (t) => {
  const item = { security_level: "insecure" }
  t.true(meetsSecurityLevel(item, SECURITY_LEVEL_PUBLIC))
  t.false(meetsSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsSecurityLevel() returns false for null item", (t) => {
  t.false(meetsSecurityLevel(null, SECURITY_LEVEL_PUBLIC))
})

test("meetsSecurityLevel() returns false for undefined item", (t) => {
  t.false(meetsSecurityLevel(undefined, SECURITY_LEVEL_PUBLIC))
})

test("meetsSecurityLevel() uses custom securityKey", (t) => {
  const item = { level: SECURITY_LEVEL_SENSITIVE }
  t.true(meetsSecurityLevel(item, SECURITY_LEVEL_SENSITIVE, "level"))
})

test("meetsSecurityLevel() treats missing security level as SECURITY_LEVEL_PUBLIC", (t) => {
  const item = { name: "test" }
  t.true(meetsSecurityLevel(item, SECURITY_LEVEL_PUBLIC))
  t.false(meetsSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

// ============================================
// meetsMetaSecurityLevel tests
// ============================================

test("meetsMetaSecurityLevel() returns true when meta.securityLevel equals required level", (t) => {
  const item = { meta: { securityLevel: SECURITY_LEVEL_COMMISSION } }
  t.true(meetsMetaSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsMetaSecurityLevel() returns true when meta.securityLevel exceeds required level", (t) => {
  const item = { meta: { securityLevel: SECURITY_LEVEL_SENSITIVE } }
  t.true(meetsMetaSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsMetaSecurityLevel() returns false when meta.securityLevel is below required level", (t) => {
  const item = { meta: { securityLevel: SECURITY_LEVEL_PUBLIC } }
  t.false(meetsMetaSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsMetaSecurityLevel() treats invalid meta.securityLevel as SECURITY_LEVEL_PUBLIC (default)", (t) => {
  const item = { meta: { securityLevel: "insecure" } }
  t.true(meetsMetaSecurityLevel(item, SECURITY_LEVEL_PUBLIC))
  t.false(meetsMetaSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsMetaSecurityLevel() returns false for null item", (t) => {
  t.false(meetsMetaSecurityLevel(null, SECURITY_LEVEL_PUBLIC))
})

test("meetsMetaSecurityLevel() returns false for undefined item", (t) => {
  t.false(meetsMetaSecurityLevel(undefined, SECURITY_LEVEL_PUBLIC))
})

test("meetsMetaSecurityLevel() treats missing meta as SECURITY_LEVEL_PUBLIC", (t) => {
  const item = { name: "test" }
  t.true(meetsMetaSecurityLevel(item, SECURITY_LEVEL_PUBLIC))
  t.false(meetsMetaSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

test("meetsMetaSecurityLevel() treats missing meta.securityLevel as SECURITY_LEVEL_PUBLIC", (t) => {
  const item = { meta: {} }
  t.true(meetsMetaSecurityLevel(item, SECURITY_LEVEL_PUBLIC))
  t.false(meetsMetaSecurityLevel(item, SECURITY_LEVEL_COMMISSION))
})

// ============================================
// Security hierarchy validation tests
// ============================================

test("security hierarchy: PUBLIC < COMMISSION < SENSITIVE", (t) => {
  const publicItem = { security_level: SECURITY_LEVEL_PUBLIC }
  const commissionItem = { security_level: SECURITY_LEVEL_COMMISSION }
  const sensitiveItem = { security_level: SECURITY_LEVEL_SENSITIVE }

  // PUBLIC only meets PUBLIC
  t.true(meetsSecurityLevel(publicItem, SECURITY_LEVEL_PUBLIC))
  t.false(meetsSecurityLevel(publicItem, SECURITY_LEVEL_COMMISSION))
  t.false(meetsSecurityLevel(publicItem, SECURITY_LEVEL_SENSITIVE))

  // COMMISSION meets PUBLIC and COMMISSION
  t.true(meetsSecurityLevel(commissionItem, SECURITY_LEVEL_PUBLIC))
  t.true(meetsSecurityLevel(commissionItem, SECURITY_LEVEL_COMMISSION))
  t.false(meetsSecurityLevel(commissionItem, SECURITY_LEVEL_SENSITIVE))

  // SENSITIVE meets all levels
  t.true(meetsSecurityLevel(sensitiveItem, SECURITY_LEVEL_PUBLIC))
  t.true(meetsSecurityLevel(sensitiveItem, SECURITY_LEVEL_COMMISSION))
  t.true(meetsSecurityLevel(sensitiveItem, SECURITY_LEVEL_SENSITIVE))
})
