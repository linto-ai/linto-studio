<template>
  <!-- Searchable multi-selection of languages, opened from a "Modify" button.
       Shared by the transcription languages and the translations. -->
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
    :searchPlaceholder="$t('transcription_create.language.search')"
    content-class="language-picker__popover"
    @input="emitCodes">
    <template #trigger="{ ariaProps }">
      <Button
        v-bind="ariaProps"
        type="button"
        variant="link"
        size="sm"
        :disabled="disabled"
        :aria-label="$t('transcription_create.summary.edit_row', { label })">
        {{ $t("transcription_create.summary.edit") }}
      </Button>
    </template>
    <template #item="{ item }">
      <span class="language-picker__item flex align-center gap-small">
        <span class="flex1">{{ item.name }}</span>
        <Chip
          v-if="item.changesEngine"
          primary
          :value="$t('transcription_create.language.changes_engine')" />
      </span>
    </template>
    <template #footer>
      <p v-if="hasEngineChange" class="language-picker__note">
        {{ $t("transcription_create.language.changes_engine_note") }}
      </p>
    </template>
  </PopoverList>
</template>
<script>
import { AUTO_LANGUAGE } from "@/const/transcriptionCreate.js"
import { computeLanguageGroups } from "@/tools/transcriptionCreate/computeLanguageGroups.js"
import PopoverList from "@/components/atoms/PopoverList.vue"
import Chip from "@/components/atoms/Chip.vue"

export default {
  name: "LanguagePicker",
  components: { PopoverList, Chip },
  props: {
    // Accessible name of the list
    label: { type: String, required: true },
    // Chosen codes
    value: { type: Array, required: true },
    // [{ code, changesEngine? }]: the flag adds a badge to the option
    options: { type: Array, required: true },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    hasEngineChange() {
      return this.options.some((option) => option.changesEngine)
    },
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
    computeDetectionItem({ code, changesEngine }) {
      return {
        id: code,
        name: this.$t("lang.automatic"),
        changesEngine,
      }
    },
    computeLanguageItem({ code, label, changesEngine, group }) {
      return {
        id: code,
        name: label,
        changesEngine,
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

.language-picker__item {
  width: 100%;
}

.language-picker__note {
  margin: 0;
  padding: var(--small-gap);
  border-top: var(--border-block);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}
</style>
