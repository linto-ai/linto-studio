<template>
  <div class="flex col">
    <label for="channel-selector">{{
      $t("session.live_page.translation_selector.label")
    }}</label>
    <CustomSelect
      class="fullwidth"
      v-model="selectedTranslations"
      id="translation-selector"
      :aria-label="$t('session.live_page.translation_selector.label')"
      :options="translationsList" />
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import CustomSelect from "./CustomSelect.vue"

import { bus } from "../main.js"
export default {
  props: {
    selectedChannel: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    name() {
      return "name"
    },
    translationsList() {
      console.log("translationsList", this.selectedChannel.translations)
      return {
        original: [
          {
            value: "original",
            text: this.$i18n.t(
              "session.live_page.translation_selector.original_language",
            ),
          },
        ],
        translations: this.selectedChannel.translations.map((translation) => {
          return {
            value: translation,
            text: translation,
          }
        }),
      }
    },
    selectedTranslations: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  mounted() {},
  methods: {},
  components: { Fragment, CustomSelect },
}
</script>
