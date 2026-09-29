// Session cookie set by the mobile login page before leaving for an OIDC
// provider. The classic entry (redirect.js) reads it on the way back to
// send the browser to /m/ whatever the device looks like.
export const MOBILE_SSO_RETURN_COOKIE = "mobile_sso_return"
