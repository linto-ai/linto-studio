<template>
  <div class="flex col">
    <label for="channel-selector" class="text-cut" v-if="!customLabel">{{
      $t("session.live_page.translation_selector.label")
    }}</label>
    <label for="channel-selector" class="text-cut" v-else>{{
      customLabel
    }}</label>
    <select v-model="selectedTranslations" id="channel-selector">
      <option v-for="t in translationsList" :value="t.id">{{ t.text }}</option>
    </select>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import CustomSelect from "@/components/molecules/CustomSelect.vue"

import { bus } from "@/main.js"
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
    qualifiedForCrossSubtitles: {
      type: Boolean,
      required: false,
      default: false,
    },
    customLabel: {
      type: String,
      required: false,
      default: null,
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
      let languageNames = new Intl.DisplayNames([this.$i18n.locale], {
        type: "language",
      })

      let base = []
      base.push({
        value: "original",
        text: this.$i18n.t(
          "session.live_page.translation_selector.original_language",
        ),
        id: "original",
      })

      if (this.qualifiedForCrossSubtitles) {
        base.push({
          value: "crossSubtitles",
          text: this.$i18n.t(
            "session.live_page.translation_selector.cross_translation",
          ),
          id: "crossSubtitles",
        })
      }

      const translations = this.selectedChannel.translations
        .map((translation) => {
          return {
            value: translation,
            text: languageNames.of(translation),
            id: translation,
          }
        })
        .sort((t1, t2) => t1.text.localeCompare(t2.text))

      return [...base, ...translations]
    },
    selectedTranslations: {
      get() {
        return this.value
      },
      set(value) {
        console.log(value)
        this.$emit("input", value)
      },
    },
  },
  mounted() {},
  methods: {},
  components: { Fragment, CustomSelect },
}
</script>
