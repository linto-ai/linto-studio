import test from "ava"
import { buildMobileSsoLoginUrl } from "../buildMobileSsoLoginUrl.js"

test("buildMobileSsoLoginUrl() starts the provider login for the app", (t) => {
  const url = buildMobileSsoLoginUrl({
    authBase: "https://studio.example.org/cm-api/auth",
    providerPath: "oidc/google",
    redirectUri: "ai.linto.studio://login/oidc",
    codeChallenge: "chal-lenge_1",
  })

  t.is(
    url,
    "https://studio.example.org/cm-api/auth/oidc/google/login" +
      "?client=mobile" +
      "&redirect_uri=ai.linto.studio%3A%2F%2Flogin%2Foidc" +
      "&code_challenge=chal-lenge_1",
  )
})
