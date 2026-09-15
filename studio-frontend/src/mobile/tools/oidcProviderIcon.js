const ICONS = {
  linagora: "/img/logo_linagora.webp",
  Google: "/img/google.png",
  Github: "/img/github-mark.svg",
  eu: "/img/eu-flag.svg",
}
const DEFAULT_ICON = "/img/building.svg"

/**
 * Logo of an OIDC provider, same mapping as the classic login button.
 * @param {string} name
 * @returns {string}
 */
export function oidcProviderIcon(name) {
  return ICONS[name] ?? DEFAULT_ICON
}
