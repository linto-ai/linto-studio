const { generators } = require("openid-client")

const { encrypt, decrypt } = require(
  `${process.cwd()}/components/WebServer/config/passport/token/encryption`,
)
const { Unauthorized } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

const SESSION_KEY = "mobileSso"
const CODE_TTL_MS = 60 * 1000
// S256 PKCE challenge (RFC 7636): bounded, it travels in the session cookie.
const CODE_CHALLENGE_FORMAT = /^[A-Za-z0-9_-]{43}$/

// Off while MOBILE_SSO_REDIRECT_URIS is empty: every login then ends on the front.
function allowedRedirectUris() {
  return (process.env.MOBILE_SSO_REDIRECT_URIS || "")
    .split(",")
    .map((uri) => uri.trim())
    .filter((uri) => URL.canParse(uri))
}

function isMobileLogin(req) {
  return (
    req.query.client === "mobile" &&
    allowedRedirectUris().includes(req.query.redirect_uri) &&
    typeof req.query.code_challenge === "string" &&
    CODE_CHALLENGE_FORMAT.test(req.query.code_challenge)
  )
}

// Login start: keeps the app's return address and PKCE challenge for the callback.
function remember(req, res, next) {
  if (isMobileLogin(req)) {
    req.session[SESSION_KEY] = {
      redirectUri: req.query.redirect_uri,
      codeChallenge: req.query.code_challenge,
    }
  } else {
    delete req.session[SESSION_KEY]
  }
  next()
}

// Callback: answers the login when the app started it, returns false otherwise.
function finish(req, res, token) {
  const pending = req.session[SESSION_KEY]
  if (!pending) return false
  if (!allowedRedirectUris().includes(pending.redirectUri)) return false
  delete req.session[SESSION_KEY]

  const url = new URL(pending.redirectUri)
  if (token) {
    const code = encrypt(
      JSON.stringify({
        auth_token: token.auth_token,
        user_id: token.user_id,
        codeChallenge: pending.codeChallenge,
        expiresAt: Date.now() + CODE_TTL_MS,
      }),
    )
    url.searchParams.set("code", code)
  } else {
    url.searchParams.set("error", "sso")
  }
  res.redirect(url.toString())
  return true
}

function readCode(code, codeVerifier) {
  if (typeof code !== "string" || typeof codeVerifier !== "string") return null

  let payload
  try {
    payload = JSON.parse(decrypt(code))
  } catch (err) {
    return null
  }
  if (!payload || payload.expiresAt < Date.now()) return null
  if (generators.codeChallenge(codeVerifier) !== payload.codeChallenge)
    return null

  return { auth_token: payload.auth_token, user_id: payload.user_id }
}

// The app trades the code of its redirect for the tokens.
function exchange(req, res, next) {
  const token = readCode(req.body.code, req.body.code_verifier)
  if (!token) return next(new Unauthorized())
  res.status(200).json(token)
}

module.exports = { remember, finish, exchange }
