import test from "ava"
import { isSameAuth } from "../isSameAuth.js"

const AUTH = { userId: "u1", authToken: "t1", refreshToken: "r1" }

test("no session on both sides is the same", (t) => {
  t.true(isSameAuth(null, null))
})

test("a session and none differ", (t) => {
  t.false(isSameAuth(AUTH, null))
  t.false(isSameAuth(null, AUTH))
})

test("same user and token, whatever the refresh token", (t) => {
  t.true(isSameAuth(AUTH, { ...AUTH, refreshToken: null }))
})

test("another token differs", (t) => {
  t.false(isSameAuth(AUTH, { ...AUTH, authToken: "t2" }))
})

test("another user differs", (t) => {
  t.false(isSameAuth(AUTH, { ...AUTH, userId: "u2" }))
})
