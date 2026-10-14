import i18n from "@/i18n"
import { isOwnPersonalOrganization } from "@/tools/user/isOwnPersonalOrganization"

export function orgDisplayName(org, userId) {
  if (!org) return ""
  if (isOwnPersonalOrganization(org, userId)) {
    return i18n.t("navigation.sections.my_space")
  }
  return org.name
}
