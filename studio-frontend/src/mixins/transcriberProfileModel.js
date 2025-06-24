import transriberImageFromtype from "@/tools/transriberImageFromtype.js"

export const transcriberProfileModelMixin = {
  computed: {
    name() {
      return this.profile.config.name || ""
    },
    description() {
      return this.profile.config.description || ""
    },
    type() {
      return transriberImageFromtype(this.profile.config.type)
    },
    alternativeTextForType() {
      return this.profile.config.type || ""
    },
    languages() {
      const langs_str = this.profile.config.languages.map(
        (lang) => lang.candidate,
      )
      return langs_str.join(", ")
    },
    id() {
      return this.profile.id
    },
    transcriberOrganizationId() {
      return this.profile.organizationId
    },
    hasOrganization() {
      return this.profile.organizationId !== null
    },
  },
}
