import test from "ava"
import { buildSsoPayload } from "../buildSsoPayload.js"

const VALUES = {
  enabled: true,
  issuerUrl: " https://login.example.com ",
  clientId: " studio ",
  clientSecret: "",
  scope: "openid, email",
  emailDomains: "@Acme.com, acme.fr",
  authorizationUrl: "",
  tokenUrl: " https://login.example.com/token ",
  userInfoUrl: "",
}

test("builds the body, leaves out empty optional fields and the secret", (t) => {
  t.deepEqual(buildSsoPayload(VALUES), {
    type: "oidc",
    enabled: true,
    issuerUrl: "https://login.example.com",
    clientId: "studio",
    scope: ["openid", "email"],
    emailDomains: ["acme.com", "acme.fr"],
    tokenUrl: "https://login.example.com/token",
  })
})

test("sends the secret when typed", (t) => {
  const payload = buildSsoPayload({ ...VALUES, clientSecret: "s3cret" })
  t.is(payload.clientSecret, "s3cret")
})
