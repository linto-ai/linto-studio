const fs = require("fs")
const { Issuer, generators, custom } = require("openid-client")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)
const { decrypt } = require(
  `${process.cwd()}/components/WebServer/config/passport/token/encryption`,
)

const CALLBACK_PATH = "/auth/oidc/organization/cb"
const DISCOVERY_TTL_MS = 10 * 60 * 1000
const issuerCache = new Map()

// Extra CA trusted when talking to identity providers (dev: a self-signed IdP).
if (process.env.ORGANIZATION_SSO_CA_FILE) {
  custom.setHttpOptionsDefaults({
    ca: fs.readFileSync(process.env.ORGANIZATION_SSO_CA_FILE),
  })
}

// Login failures redirected to the front with `reason` as the error code.
class OrganizationSsoLoginError extends Error {
  constructor(reason, message) {
    super(message || reason)
    this.name = "OrganizationSsoLoginError"
    this.reason = reason
  }
}

function emailDomain(email) {
  if (typeof email !== "string") return null
  const at = email.lastIndexOf("@")
  if (at < 1) return null
  const domain = email
    .slice(at + 1)
    .trim()
    .toLowerCase()
  return domain || null
}

// The organization whose enabled SSO claims the email domain, or null.
async function findOrganizationForEmail(email) {
  const domain = emailDomain(email)
  if (!domain) return null
  return throwIfError(await model.organizations.getBySsoEmailDomain(domain))
}

// Where the identity provider sends the user back. Must be registered on the
// IdP client; the front displays the same URL to the admin.
function callbackUrl(req) {
  if (process.env.ORGANIZATION_SSO_CALLBACK_URI)
    return process.env.ORGANIZATION_SSO_CALLBACK_URI
  return `${req.protocol}://${req.get("host")}${CALLBACK_PATH}`
}

function endpointOverrides(sso) {
  const overrides = {}
  if (sso.authorizationUrl)
    overrides.authorization_endpoint = sso.authorizationUrl
  if (sso.tokenUrl) overrides.token_endpoint = sso.tokenUrl
  if (sso.userInfoUrl) overrides.userinfo_endpoint = sso.userInfoUrl
  return overrides
}

// Discovery first; explicit endpoints override it, or replace it when the
// issuer has no discovery document.
async function resolveIssuer(sso) {
  const overrides = endpointOverrides(sso)
  const key = JSON.stringify([sso.issuerUrl, overrides])
  const cached = issuerCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.issuer

  let metadata = null
  try {
    metadata = (await Issuer.discover(sso.issuerUrl)).metadata
  } catch (err) {
    if (!overrides.authorization_endpoint || !overrides.token_endpoint)
      throw err
  }
  const issuer = new Issuer({
    issuer: sso.issuerUrl,
    ...(metadata || {}),
    ...overrides,
  })
  issuerCache.set(key, { issuer, expiresAt: Date.now() + DISCOVERY_TTL_MS })
  return issuer
}

async function buildClient(sso, redirectUri) {
  const issuer = await resolveIssuer(sso)
  return new issuer.Client({
    client_id: sso.clientId,
    client_secret: decrypt(sso.clientSecret),
    redirect_uris: [redirectUri],
    response_types: ["code"],
    token_endpoint_auth_method: "client_secret_post",
  })
}

// PKCE + state + nonce, all kept in the session until the callback.
function authorizationRequest(client, sso, redirectUri) {
  const state = generators.state()
  const nonce = generators.nonce()
  const codeVerifier = generators.codeVerifier()
  const url = client.authorizationUrl({
    scope: sso.scope.join(" "),
    redirect_uri: redirectUri,
    state,
    nonce,
    code_challenge: generators.codeChallenge(codeVerifier),
    code_challenge_method: "S256",
  })
  return { url, state, nonce, codeVerifier }
}

// The id_token is validated when the issuer publishes its keys; otherwise the
// userinfo endpoint is the source of truth.
async function fetchClaims(client, req, redirectUri, checks) {
  const params = client.callbackParams(req)
  const { jwks_uri, userinfo_endpoint } = client.issuer.metadata

  let tokenSet
  let claims = {}
  if (jwks_uri) {
    tokenSet = await client.callback(redirectUri, params, checks)
    claims = tokenSet.claims()
  } else {
    tokenSet = await client.oauthCallback(redirectUri, params, {
      state: checks.state,
      code_verifier: checks.code_verifier,
    })
  }
  if (!claims.email && userinfo_endpoint) {
    claims = { ...claims, ...(await client.userinfo(tokenSet)) }
  }
  return claims
}

// An organization's IdP may only sign in users of the domains it declared.
function assertEmailAllowed(claims, sso) {
  const domain = emailDomain(claims && claims.email)
  if (!domain)
    throw new OrganizationSsoLoginError(
      "missing_email",
      "The identity provider returned no email",
    )
  if (!sso.emailDomains.includes(domain))
    throw new OrganizationSsoLoginError(
      "email_not_allowed",
      `${domain} is not attached to this organization`,
    )
}

async function ensureMembership(organizationId, userId) {
  const rows = throwIfError(await model.organizations.getById(organizationId))
  const organization = rows[0]
  if (!organization) return
  const id = userId.toString()
  if (organization.users.some((u) => u.userId === id)) return
  organization.users.push({ userId: id, role: ROLES.MEMBER })
  throwIfError(await model.organizations.update(organization))
}

// Same personal organization as a regular signup, for users who predate it.
async function ensurePersonalOrganization(user) {
  if (process.env.DISABLE_DEFAULT_ORGANIZATION_CREATION === "true") return
  const personal = await model.organizations.getPersonalByOwner(user._id)
  if (personal) return
  throwIfError(
    await model.organizations.createDefault(user._id.toString(), user.email),
  )
}

// The SSO organization is the user's workspace: member, default organization
// when they have none, and no onboarding wizard (the personal organization is
// created here instead of by the wizard).
async function attachUserToOrganization(userId, organizationId) {
  await ensureMembership(organizationId, userId)

  const rows = throwIfError(await model.users.getById(userId, true))
  const user = rows[0]
  if (!user) return
  await ensurePersonalOrganization(user)

  const updates = {}
  if (!user.defaultOrganization)
    updates.defaultOrganization = organizationId.toString()
  if (user.onboarded === false) updates.onboarded = true
  if (Object.keys(updates).length === 0) return
  throwIfError(await model.users.update({ _id: userId, ...updates }))
}

module.exports = {
  OrganizationSsoLoginError,
  emailDomain,
  findOrganizationForEmail,
  callbackUrl,
  buildClient,
  authorizationRequest,
  fetchClaims,
  assertEmailAllowed,
  ensureMembership,
  attachUserToOrganization,
}
