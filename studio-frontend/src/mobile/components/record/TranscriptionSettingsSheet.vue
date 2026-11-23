<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.settings.title')"
    @input="$emit('input', $event)">
    <p v-if="!service" class="m-muted">
      {{ $t("mobile.settings.no_service") }}
    </p>
    <form v-else class="m-settings" @submit.prevent="$emit('input', false)">
      <label class="m-settings__field">
        <span>{{ $t("mobile.settings.language") }}</span>
        <select
          :value="choices.language"
          @change="update('language', $event.target.value)">
          <option
            v-for="language in languages"
            :key="language"
            :value="language">
            {{ languageLabel(language) }}
          </option>
        </select>
      </label>
      <label class="m-settings__toggle">
        <span class="m-grow">{{ $t("mobile.settings.diarization") }}</span>
        <input
          type="checkbox"
          :checked="choices.diarization"
          :disabled="!supportsDiarization"
          @change="update('diarization', $event.target.checked)" />
      </label>
      <p v-if="!supportsDiarization" class="m-muted">
        {{ $t("mobile.settings.no_diarization") }}
      </p>
      <div
        v-if="voiceIdentificationCapable && choices.diarization"
        class="m-settings__field">
        <span>{{ $t("mobile.settings.voices") }}</span>
        <p v-if="voiceCollections.length === 0" class="m-muted">
          {{ $t("mobile.settings.voices_empty") }}
        </p>
        <ul v-else class="m-settings__collections">
          <VoiceCollectionRow
            v-for="collection in voiceCollections"
            :key="collection._id"
            :collection="collection"
            :selected="selectedCollections.includes(collection._id)"
            :voices="voicesByCollection[collection._id] || []"
            :loaded="collection._id in voicesByCollection"
            @toggle="toggleChoice('voiceCollections', collection._id)"
            @load-voices="loadVoices(collection)" />
        </ul>
        <p class="m-muted">{{ $t("mobile.settings.voices_help") }}</p>
      </div>
      <div v-if="hotwordsAvailable" class="m-settings__field">
        <span>{{ $t("mobile.settings.dictionaries") }}</span>
        <label
          v-for="dictionary in hotwordDictionaries"
          :key="dictionary._id"
          class="m-settings__toggle">
          <span class="m-grow">{{ dictionary.name }}</span>
          <input
            type="checkbox"
            :checked="selectedDictionaries.includes(dictionary._id)"
            @change="toggleChoice('hotwordDictionaries', dictionary._id)" />
        </label>
        <p class="m-muted">{{ $t("mobile.settings.dictionaries_help") }}</p>
      </div>
      <SharingSettingsFields
        :members-right="choices.membersRight"
        :folder-id="choices.folderId"
        @change="updateMany" />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        block
        :label="$t('mobile.common.confirm')" />
    </form>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import VoiceCollectionRow from "@/mobile/components/record/VoiceCollectionRow.vue"
import SharingSettingsFields from "@/mobile/components/record/SharingSettingsFields.vue"
import { loadCollectionVoices } from "@/mobile/services/voices/loadCollectionVoices.js"

// Choices for the next recordings; every edit emits "change".
export default {
  name: "TranscriptionSettingsSheet",
  components: { BottomSheet, VoiceCollectionRow, SharingSettingsFields },
  props: {
    value: { type: Boolean, default: false },
    // The service the choices are offered for
    service: { type: Object, default: null },
    choices: { type: Object, required: true },
    voiceCollections: { type: Array, default: () => [] },
    voiceIdentificationCapable: { type: Boolean, default: false },
    hotwordDictionaries: { type: Array, default: () => [] },
    hotwordsAvailable: { type: Boolean, default: false },
    organizationId: { type: String, default: "" },
  },
  data() {
    return { voicesByCollection: {} }
  },
  computed: {
    languages() {
      return (this.service?.language || "*").split(",")
    },
    selectedCollections() {
      return this.choices.voiceCollections ?? []
    },
    selectedDictionaries() {
      return this.choices.hotwordDictionaries ?? []
    },
    supportsDiarization() {
      return (this.service?.sub_services?.diarization?.length ?? 0) > 0
    },
  },
  methods: {
    update(key, value) {
      this.updateMany({ [key]: value })
    },
    updateMany(partial) {
      this.$emit("change", { ...this.choices, ...partial })
    },
    async loadVoices(collection) {
      const voices = await loadCollectionVoices(this.organizationId, collection)
      this.voicesByCollection = {
        ...this.voicesByCollection,
        [collection._id]: voices,
      }
    },
    toggleChoice(key, id) {
      const current = this.choices[key] ?? []
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
      this.update(key, next)
    },
    languageLabel(language) {
      return language === "*"
        ? this.$t("lang.automatic")
        : this.$t(`lang.${language.slice(0, 2)}`)
    },
  },
}
</script>

<style scoped>
.m-settings {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-settings__field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-settings__field select,
.m-settings__toggle input {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-settings__toggle {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 48px;
}

.m-settings__toggle input {
  width: 24px;
  height: 24px;
  min-height: 0;
  padding: 0;
  accent-color: var(--m-primary);
}

.m-settings__collections {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}
</style>
