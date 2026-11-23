import test from "ava"
import { settleWithin } from "../settleWithin.js"

test("settleWithin() answers the value of a promise settled in time", async (t) => {
  t.deepEqual(await settleWithin(Promise.resolve(3), 50), {
    status: "done",
    value: 3,
  })
})

test("settleWithin() answers the error of a rejected promise", async (t) => {
  const error = new Error("nope")
  t.deepEqual(await settleWithin(Promise.reject(error), 50), {
    status: "failed",
    error,
  })
})

test("settleWithin() gives up on a promise that never settles", async (t) => {
  t.deepEqual(await settleWithin(new Promise(() => {}), 10), {
    status: "timeout",
  })
})
