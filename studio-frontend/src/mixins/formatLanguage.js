import formatLanguageCode from "@/tools/formatLanguage"

export const formatLanguageMixin = {
  methods: {
    formatLanguage(lang) {
      return formatLanguageCode(lang, {
        locale: this.$i18n.locale,
        autoLabel: this.$t("lang.automatic"),
      })
    },
  },
}
