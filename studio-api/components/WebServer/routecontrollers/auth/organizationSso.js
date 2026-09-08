const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:auth:organizationSso",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)
const { OrganizationSsoNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const { generateUserToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/controllers/oidcTokenGenerator`,
)
const ssoLogin = require(
  `${process.cwd()}/components/WebServer/controllers/organization/ssoLogin`,
)

const SESSION_KEY = "organizationSso"

function frontUrl(path) {
  return (process.env.FRONTEND_DOMAIN || "") + path
}

// The session cookie is flagged Secure only on https, so a plain-http dev
// setup can still run the flow (cookie-session refuses Secure over http).
function matchCookieSecurity(req) {
  if (req.sessionOptions) req.sessionOptions.secure = req.secure === true
}

function redirectWithError(res, reason) {
  debug("organization sso login failed: %s", reason)
  res.redirect(frontUrl(`/login?error=organization_sso&reason=${reason}`))
}

// Tells the login page whether the email domain is attached to an SSO.
async function resolveOrganizationSso(req, res, next) {
  try {
    const organization = await ssoLogin.findOrganizationForEmail(
      req.body && req.body.email,
    )
    if (!organization) throw new OrganizationSsoNotFound()

    res.status(200).send({
      organizationId: organization._id.toString(),
      name: organization.name,
    })
  } catch (err) {
    next(err)
  }
}

async function loginWithOrganizationSso(req, res, next) {
  try {
    const organization = await ssoLogin.findOrganizationForEmail(
      req.query.email,
    )
    if (!organization) return redirectWithError(res, "no_sso")

    const redirectUri = ssoLogin.callbackUrl(req)
    const client = await ssoLogin.buildClient(organization.sso, redirectUri)
    const request = ssoLogin.authorizationRequest(
      client,
      organization.sso,
      redirectUri,
    )

    matchCookieSecurity(req)
    req.session[SESSION_KEY] = {
      organizationId: organization._id.toString(),
      state: request.state,
      nonce: request.nonce,
      codeVerifier: request.codeVerifier,
    }
    res.redirect(request.url)
  } catch (err) {
    debug("cannot start the organization sso login: %o", err)
    redirectWithError(res, "idp_error")
  }
}

async function organizationSsoCallback(req, res, next) {
  matchCookieSecurity(req)
  const pending = req.session && req.session[SESSION_KEY]
  if (req.session) req.session[SESSION_KEY] = null
  if (!pending) return redirectWithError(res, "session_expired")

  try {
    const rows = throwIfError(
      await model.organizations.getById(pending.organizationId),
    )
    const organization = rows[0]
    if (!organization || !organization.sso || !organization.sso.enabled)
      return redirectWithError(res, "no_sso")

    const redirectUri = ssoLogin.callbackUrl(req)
    const client = await ssoLogin.buildClient(organization.sso, redirectUri)
    const claims = await ssoLogin.fetchClaims(client, req, redirectUri, {
      state: pending.state,
      nonce: pending.nonce,
      code_verifier: pending.codeVerifier,
    })
    ssoLogin.assertEmailAllowed(claims, organization.sso)

    const token = await generateUserToken(
      claims.email,
      claims.family_name,
      claims.given_name,
    )
    await ssoLogin.attachUserToOrganization(token.user_id, organization._id)

    res.redirect(frontUrl(`/login/oidc?token=${token.auth_token}`))
  } catch (err) {
    debug("organization sso callback failed: %o", err)
    redirectWithError(res, err.reason || "idp_error")
  }
}

module.exports = {
  resolveOrganizationSso,
  loginWithOrganizationSso,
  organizationSsoCallback,
}
