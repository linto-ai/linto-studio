import test from "ava"
import { testHttpsUrl } from "../fields/testHttpsUrl.js"
import { testEmailDomains } from "../fields/testEmailDomains.js"
import { testOidcScope } from "../fields/testOidcScope.js"

const translate = (key) => key

test("testHttpsUrl normalizes like the other url fields and requires https", (t) => {
  t.true(testHttpsUrl({ value: " https://a.b/c " }, translate))
  t.true(testHttpsUrl({ value: "" }, translate))
  const bare = { value: "login.example.com/realms/acme" }
  t.true(testHttpsUrl(bare, translate))
  t.is(bare.value, "https://login.example.com/realms/acme")
  const field = { value: "http://a.b" }
  t.false(testHttpsUrl(field, translate))
  t.is(field.error, "organisation.sso.errors.invalid_https_url")
  t.false(testHttpsUrl({ value: "not a url" }, translate))
})

test("testEmailDomains normalizes and flags the first invalid domain", (t) => {
  t.true(testEmailDomains({ value: "@Acme.com, acme.fr" }, translate))
  t.true(testEmailDomains({ value: "" }, translate))
  const field = { value: "acme.com, nope" }
  t.false(testEmailDomains(field, translate))
  t.is(field.error, "organisation.sso.errors.invalid_domain")
})

test("testOidcScope requires openid", (t) => {
  t.true(testOidcScope({ value: "openid email" }, translate))
  const field = { value: "email, profile" }
  t.false(testOidcScope(field, translate))
  t.is(field.error, "organisation.sso.errors.scope_openid")
})
