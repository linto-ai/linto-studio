import test from "ava"
import { computeAuthFromLogin } from "../computeAuthFromLogin.js"

test("keeps the user, the token and the refresh token", (t) => {
  t.deepEqual(
    computeAuthFromLogin({
      user_id: "u1",
      auth_token: "t1",
      refresh_token: "r1",
    }),
    { userId: "u1", authToken: "t1", refreshToken: "r1" },
  )
})

test("an SSO answer has no refresh token", (t) => {
  t.deepEqual(computeAuthFromLogin({ user_id: "u1", auth_token: "t1" }), {
    userId: "u1",
    authToken: "t1",
    refreshToken: null,
  })
})

test("no token, no session", (t) => {
  t.is(computeAuthFromLogin({ user_id: "u1" }), null)
  t.is(computeAuthFromLogin(undefined), null)
})
