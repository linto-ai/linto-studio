const ICONS = {
  linagora: { src: "/img/logo_linagora.webp", background: "#c71f45" },
  Google: { src: "/img/google.png", background: "" },
  Github: { src: "/img/github-mark.svg", background: "" },
  eu: { src: "/img/eu-flag.svg", background: "#003399" },
}
const DEFAULT_ICON = { src: "/img/building.svg", background: "" }

/**
 * Logo of an OIDC provider and the disc colour it needs behind it (the
 * LINAGORA and EU logos are white on transparent), same as the classic
 * login button.
 * @param {string} name
 * @returns {{ src: string, background: string }}
 */
export function oidcProviderIcon(name) {
  return ICONS[name] ?? DEFAULT_ICON
}
