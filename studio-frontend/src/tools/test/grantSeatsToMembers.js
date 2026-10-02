import test from "ava"
import { grantSeatsToMembers } from "../grantSeatsToMembers.js"

const ASSIGNMENTS = [
  { userId: "u1", role: 2 },
  { userId: "u2", role: 3 },
  { userId: "u3", role: 4 },
]

function success() {
  return { status: "success" }
}

function failure(status, data = {}) {
  return {
    status: "error",
    message: data.message || "boom",
    error: { response: { status, data } },
  }
}

test("assigns every role, in order", async (t) => {
  const calls = []
  const result = await grantSeatsToMembers(ASSIGNMENTS, (userId, role) => {
    calls.push([userId, role])
    return success()
  })
  t.deepEqual(calls, [
    ["u1", 2],
    ["u2", 3],
    ["u3", 4],
  ])
  t.is(result.succeeded.length, 3)
  t.deepEqual(result.failed, [])
  t.false(result.stopped)
})

test("keeps going after a per-member refusal", async (t) => {
  const result = await grantSeatsToMembers(ASSIGNMENTS, (userId) =>
    userId === "u2"
      ? failure(403, { message: "You cannot change the last admin role" })
      : success(),
  )
  t.deepEqual(
    result.succeeded.map((entry) => entry.userId),
    ["u1", "u3"],
  )
  t.is(result.failed.length, 1)
  t.is(result.failed[0].message, "You cannot change the last admin role")
  t.false(result.stopped)
})

test("stops as soon as the plan runs out of seats", async (t) => {
  const attempted = []
  const result = await grantSeatsToMembers(ASSIGNMENTS, (userId) => {
    attempted.push(userId)
    return userId === "u2"
      ? failure(402, { code: "SAAS_QUOTA_EXCEEDED", capability: "seats" })
      : success()
  })
  t.deepEqual(attempted, ["u1", "u2"])
  t.true(result.stopped)
  t.is(result.failed[0].capability, "seats")
})

test("a quota refusal on another capability does not stop the batch", async (t) => {
  const result = await grantSeatsToMembers(ASSIGNMENTS, (userId) =>
    userId === "u1"
      ? failure(402, {
          code: "SAAS_QUOTA_EXCEEDED",
          capability: "import.minutes",
        })
      : success(),
  )
  t.false(result.stopped)
  t.is(result.succeeded.length, 2)
})

test("a failure after a seat refusal cannot revive the run", async (t) => {
  const result = await grantSeatsToMembers(ASSIGNMENTS, (userId) =>
    userId === "u1"
      ? failure(402, { code: "SAAS_QUOTA_EXCEEDED", capability: "seats" })
      : success(),
  )
  t.true(result.stopped)
  t.is(result.succeeded.length, 0)
  t.is(result.failed.length, 1)
})

test("reports progress once per attempt", async (t) => {
  const progress = []
  await grantSeatsToMembers(
    ASSIGNMENTS,
    () => success(),
    (step) => progress.push(step.done),
  )
  t.deepEqual(progress, [1, 2, 3])
})

test("an aborted request is a failure, not a crash", async (t) => {
  const result = await grantSeatsToMembers([ASSIGNMENTS[0]], () => undefined)
  t.is(result.succeeded.length, 0)
  t.is(result.failed.length, 1)
})

test("an empty batch calls nothing", async (t) => {
  let called = false
  const result = await grantSeatsToMembers([], () => {
    called = true
    return success()
  })
  t.false(called)
  t.deepEqual(result, { succeeded: [], failed: [], stopped: false })
})
