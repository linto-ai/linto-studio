import { MOBILE_SSO_RETURN_COOKIE } from "@/mobile/const/ssoReturnCookie.js"

// Called when a provider link is followed: the OIDC callback page of the
// classic app reloads "/" once signed in, and this cookie brings that load
// back to /m/. The mobile app clears it at startup.
export function markSsoReturn() {
  document.cookie = `${MOBILE_SSO_RETURN_COOKIE}=1;path=/;SameSite=Lax`
}

export function clearSsoReturn() {
  document.cookie = `${MOBILE_SSO_RETURN_COOKIE}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`
}
