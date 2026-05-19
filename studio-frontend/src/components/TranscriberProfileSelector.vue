<template>
  <GenericTable
    :columns="columns"
    :content="sortedTranscriberProfiles"
    :sortListKey="sortListKey"
    :sortListDirection="sortListDirection"
    :selectable="true"
    :selectMode="multiple ? 'multiple' : 'single'"
    :selectedRows="selectedIds"
    :rowClass="getRowClass"
    idKey="id"
    @list_sort_by="sortBy"
    @update:selectedRows="onSelectionChange">
    <template #cell-config.type="{ element }">
      <img
        class="icon medium"
        :src="typeImage(element)"
        :alt="element.config.type || ''"
        :title="element.config.type || ''" />
    </template>
    <template #cell-config.name="{ element }">
      {{ element.config.name || "" }}
    </template>
    <template #cell-config.description="{ element }">
      {{ element.config.description || "" }}
    </template>
    <template #cell-config.languages.0.candidate="{ element }">
      {{ formatLanguages(element) }}
    </template>
    <template #cell-translations="{ element }">
      <PopoverList
        v-if="translationOptionsFor(element).length > 0"
        selection
        multiple
        searchable
        :close-on-click="false"
        :value="getTranslations(element)"
        @input="onTranslationsInput(element, $event)"
        :items="translationOptionsFor(element)">
        <template #trigger="{ open }">
          <Button :icon-right="open ? 'caret-up' : 'caret-down'" size="sm">
            {{
              $tc(
                "session.profile_selector.n_translations_selected",
                getTranslations(element).length,
              )
            }}
          </Button>
        </template>
      </PopoverList>
      <Button
        v-else
        size="sm"
        disabled
        :label="$t('session.profile_selector.translation_not_available')" />
    </template>
  </GenericTable>
</template>
<script>
import { sortArray } from "@/tools/sortList.js"
import { meetsMetaSecurityLevel } from "@/tools/filterBySecurityLevel"
import { normalizeAvailableTranslations } from "@/tools/translationUtils.js"
import transriberImageFromtype from "@/tools/transriberImageFromtype.js"
import GenericTable from "@/components/molecules/GenericTable.vue"

export default {
  props: {
    profilesList: {
      type: Array,
      required: true,
    },
    value: {
      type: [Array, Object],
      required: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    securityLevel: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      sortListKey: "name",
      sortListDirection: "asc",
      l_profilesList: structuredClone(this.profilesList),
      translationState: {},
    }
  },
  computed: {
    columns() {
      return [
        { key: "config.type", label: this.$t("session.profile_selector.labels.type"), width: "auto" },
        { key: "config.name", label: this.$t("session.profile_selector.labels.name"), width: "1fr" },
        { key: "config.description", label: this.$t("session.profile_selector.labels.description"), width: "1fr" },
        { key: "config.languages.0.candidate", label: this.$t("session.profile_selector.labels.languages"), width: "1fr" },
        { key: "translations", label: this.$t("session.profile_selector.labels.translations"), width: "auto" },
      ]
    },
    sortedTranscriberProfiles() {
      return sortArray(
        this.l_profilesList,
        this.sortListKey,
        this.sortListDirection,
      )
    },
    selectedIds() {
      if (this.multiple) {
        return (this.value || []).map((profile) => profile.id)
      } else {
        return this.value ? [this.value.id] : []
      }
    },
  },
  watch: {
    profilesList: {
      handler(newList) {
        this.l_profilesList = structuredClone(newList)
      },
      deep: true,
    },
  },
  methods: {
    sortBy(key) {
      if (key === this.sortListKey) {
        this.sortListDirection =
          this.sortListDirection === "desc" ? "asc" : "desc"
      } else {
        this.sortListDirection = "desc"
      }
      this.sortListKey = key
    },
    getRowClass(profile) {
      return { "security-disabled": this.isSecurityDisabled(profile) }
    },
    isSecurityDisabled(profile) {
      if (!this.securityLevel) return false
      return !meetsMetaSecurityLevel(profile, this.securityLevel)
    },
    typeImage(profile) {
      return transriberImageFromtype(profile.config.type)
    },
    formatLanguages(profile) {
      const langs = profile.config.languages.map((lang) => lang.candidate)
      return langs.join(", ")
    },
    translationOptionsFor(profile) {
      const translations = normalizeAvailableTranslations(profile?.config?.availableTranslations)
      const languageNames = new Intl.DisplayNames([this.$i18n.locale], { type: "language" })
      return translations
        .map((t) => ({ id: t, text: languageNames.of(t) }))
        .sort((a, b) => a.text.localeCompare(b.text))
    },
    getTranslations(profile) {
      if (this.translationState[profile.id]) {
        return this.translationState[profile.id]
      }
      return []
    },
    onTranslationsInput(profile, value) {
      this.$set(this.translationState, profile.id, value)
      const localProfile = this.l_profilesList.find((p) => p.id === profile.id)
      if (localProfile) {
        localProfile.translations = value
      }
      // Build IDs with profile auto-selected, then emit once
      let ids = this.multiple ? [...this.selectedIds] : []
      if (!ids.includes(profile.id)) {
        ids.push(profile.id)
      }
      this.emitSelection(ids)
    },
    onSelectionChange(ids) {
      this.emitSelection(ids)
    },
    emitSelection(ids) {
      if (this.multiple) {
        const profiles = ids.map((id) =>
          this.l_profilesList.find((p) => p.id === id),
        ).filter(Boolean)
        this.$emit("input", structuredClone(profiles))
      } else {
        const profile = ids.length > 0
          ? this.l_profilesList.find((p) => p.id === ids[0])
          : null
        this.$emit("input", profile ? structuredClone(profile) : null)
      }
    },
  },
  components: {
    GenericTable,
  },
}
</script>
