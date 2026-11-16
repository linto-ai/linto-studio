import test from "ava"
import { readMobileSsoReturn } from "../readMobileSsoReturn.js"

const REDIRECT_URI = "ai.linto.studio://login/oidc"

test("readMobileSsoReturn() reads the code of a successful login", (t) => {
  t.deepEqual(
    readMobileSsoReturn(`${REDIRECT_URI}?code=a%2Bb%3Ac`, REDIRECT_URI),
    { code: "a+b:c" },
  )
})

test("readMobileSsoReturn() gives no code for a failed login", (t) => {
  t.deepEqual(readMobileSsoReturn(`${REDIRECT_URI}?error=sso`, REDIRECT_URI), {
    code: null,
  })
})

test("readMobileSsoReturn() ignores the fragment", (t) => {
  t.deepEqual(readMobileSsoReturn(`${REDIRECT_URI}?code=c#x`, REDIRECT_URI), {
    code: "c",
  })
})

test("readMobileSsoReturn() gives null for any other link", (t) => {
  t.is(
    readMobileSsoReturn("ai.linto.studio://other?code=c", REDIRECT_URI),
    null,
  )
  t.is(readMobileSsoReturn(`${REDIRECT_URI}/more?code=c`, REDIRECT_URI), null)
  t.is(readMobileSsoReturn("https://localhost/", REDIRECT_URI), null)
  t.is(readMobileSsoReturn(undefined, REDIRECT_URI), null)
})
