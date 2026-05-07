import { getEnv } from "./getEnv"

export function getLogoAltName() {
  const logo = getEnv("VUE_APP_LOGO")
  switch (logo) {
    case "logo-ep.svg":
      return "Logo of the European Parliament"
    case "logo-UE.svg":
      return "Logo of the European commission"
    default:
      return ""
  }
}
