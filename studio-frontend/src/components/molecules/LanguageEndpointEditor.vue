<template>
  <div class="language-endpoint-editor">
    <div class="editor-header" :class="{ 'no-endpoint': !showEndpoint }">
      <span class="header-label">{{
        $t("language_endpoint_editor.language")
      }}</span>
      <span v-if="showEndpoint" class="header-label">{{ endpointLabel }}</span>
      <span class="header-spacer"></span>
    </div>

    <div
      v-for="(item, index) in localValue"
      :key="index"
      class="editor-row"
      :class="{ 'no-endpoint': !showEndpoint }">
      <select
        class="language-select"
        :value="item.candidate"
        @change="updateCandidate(index, $event.target.value)">
        <option
          v-for="lang in availableLanguages"
          :key="lang.code"
          :value="lang.code">
          {{ lang.name }}
        </option>
      </select>

      <input
        v-if="showEndpoint"
        type="text"
        class="endpoint-input"
        :value="item.endpoint"
        :placeholder="endpointPlaceholder"
        @input="updateEndpoint(index, $event.target.value)" />

      <Button
        icon="trash"
        iconOnly
        variant="transparent"
        intent="destructive"
        size="sm"
        :title="$t('language_endpoint_editor.remove')"
        @click="removeItem(index)" />
    </div>

    <Button
      icon="plus"
      :label="$t('language_endpoint_editor.add')"
      size="sm"
      @click="addItem" />
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"

export default {
  name: "LanguageEndpointEditor",
  components: { Button },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    languages: {
      type: Array,
      required: true,
    },
    endpointLabel: {
      type: String,
      default: "Endpoint",
    },
    endpointPlaceholder: {
      type: String,
      default: "",
    },
    defaultEndpoint: {
      type: String,
      default: "",
    },
    showEndpoint: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
    availableLanguages() {
      const displayNames = new Intl.DisplayNames([this.$i18n?.locale || "en"], {
        type: "language",
      })
      return this.languages
        .map((code) => ({
          code,
          name: this.capitalizeFirst(displayNames.of(code)) || code,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    defaultLanguage() {
      return this.languages[0] || "en-US"
    },
  },
  methods: {
    capitalizeFirst(str) {
      if (!str) return str
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    updateCandidate(index, value) {
      const newValue = [...this.localValue]
      newValue[index] = { ...newValue[index], candidate: value }
      this.$emit("input", newValue)
    },
    updateEndpoint(index, value) {
      const newValue = [...this.localValue]
      newValue[index] = { ...newValue[index], endpoint: value }
      this.$emit("input", newValue)
    },
    addItem() {
      const newItem = { candidate: this.defaultLanguage }
      if (this.showEndpoint) {
        newItem.endpoint = this.defaultEndpoint
      }
      const newValue = [...this.localValue, newItem]
      this.$emit("input", newValue)
    },
    removeItem(index) {
      const newValue = this.localValue.filter((_, i) => i !== index)
      this.$emit("input", newValue)
    },
  },
}
</script>

<style scoped>
.language-endpoint-editor {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
}

.editor-header {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--small-gap);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.editor-header.no-endpoint {
  grid-template-columns: 1fr auto;
}

.header-spacer {
  width: 32px;
}

.editor-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--small-gap);
  align-items: center;
}

.editor-row.no-endpoint {
  grid-template-columns: 1fr auto;
}

.endpoint-input {
  min-width: 0;
}
</style>
