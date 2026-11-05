<template>
  <!-- Searchable multi-selection of languages. Shared by the transcription
       languages and the translations. -->
  <PopoverList
    selection
    multiple
    searchable
    returnObjects
    :selectAll="false"
    :items="items"
    :value="selectedItems"
    :ariaLabel="label"
    :closeOnClick="false"
    :placeholder="placeholder"
    :disabled="disabled"
    fullWidth
    :searchPlaceholder="$t('transcription_create.language.search')"
    content-class="language-picker__popover"
    @input="emitCodes" />
</template>
<script>
import { AUTO_LANGUAGE } from "@/const/transcriptionCreate.js"
import { computeLanguageGroups } from "@/tools/transcriptionCreate/computeLanguageGroups.js"
import PopoverList from "@/components/atoms/PopoverList.vue"

export default {
  name: "LanguagePicker",
  components: { PopoverList },
  props: {
    // Accessible name of the list
    label: { type: String, required: true },
    // Chosen codes
    value: { type: Array, required: true },
    // [{ code }]
    options: { type: Array, required: true },
    // Shown when nothing is chosen
    placeholder: { type: String, default: null },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    items() {
      const detection = this.options.find(
        (option) => option.code === AUTO_LANGUAGE,
      )
      const languages = this.options.filter(
        (option) => option.code !== AUTO_LANGUAGE,
      )
      return [
        ...(detection ? [this.computeDetectionItem(detection)] : []),
        ...computeLanguageGroups(languages, this.$i18n.locale).map(
          this.computeLanguageItem,
        ),
      ]
    },
    selectedItems() {
      return this.items.filter((item) => this.value.includes(item.id))
    },
  },
  methods: {
    computeDetectionItem({ code }) {
      return {
        id: code,
        name: this.$t("transcription_create.language.detection"),
        exclusive: true,
      }
    },
    computeLanguageItem({ code, label, group }) {
      return {
        id: code,
        name: label,
        group: this.$t(`transcription_create.language.group_${group}`),
      }
    },
    emitCodes(selectedItems) {
      this.$emit(
        "input",
        selectedItems.map((item) => item.id),
      )
    },
  },
}
</script>
<style lang="scss">
// The popover is rendered outside of this component.
.language-picker__popover {
  width: 24rem;
  max-width: calc(100vw - 2rem);
}
</style>
