import i18n from "@/i18n"

export function orgDisplayName(org, userId) {
  if (!org) return ""
  if (org.personal && org.owner === userId) {
    return i18n.t("navigation.sections.my_space")
  }
  return org.name
}
