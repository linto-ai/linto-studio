<template>
  <div class="flex col medium-padding gap-medium">
    <SessionChannelsSelector
      v-if="channels.length > 1"
      :channels="channels"
      v-model="p_selectedChannel"></SessionChannelsSelector>

    <SessionTranslationSelection
      v-if="hasTranslations"
      :qualifiedForCrossSubtitles="qualifiedForCrossSubtitles"
      :selectedChannel="selectedChannel"
      v-model="p_selectedTranslation"></SessionTranslationSelection>

    <h3>{{ $t("session.detail_page.title_interface_settings") }}</h3>
    <FormCheckbox
      :field="displayLiveTranscriptionField"
      switchDisplay
      v-model="displayLiveTranscriptionField.value" />
    <FormCheckbox
      :field="displaySubtitlesField"
      switchDisplay
      v-model="displaySubtitlesField.value" />

    <FormInput
      :field="fontSizeField"
      v-model="fontSizeField.value"
      v-if="displaySubtitlesField.value" />

    <FormCheckbox
      v-if="displaySubtitlesField.value"
      :field="displayWatermarkField"
      switchDisplay
      v-model="displayWatermarkField.value">
      <template v-slot:content-after-label>
        <button
          class="only-icon transparent"
          :aria-label="
            $t('session.live_page.watermark_settings.settings_button')
          "
          :title="$t('session.live_page.watermark_settings.settings_button')"
          @click="showWatermarkSettings = true">
          <span class="icon settings" />
        </button>
        <button
          class="only-icon transparent"
          :aria-label="$t('session.live_page.watermark_settings.unpin_button')"
          :title="$t('session.live_page.watermark_settings.unpin_button')"
          @click="togglePin"
          v-if="watermarkPinned">
          <span class="icon pin-on" />
        </button>
        <button
          class="only-icon transparent"
          :aria-label="$t('session.live_page.watermark_settings.pin_button')"
          :title="$t('session.live_page.watermark_settings.pin_button')"
          @click="togglePin"
          v-else>
          <span class="icon pin" />
        </button>
      </template>
    </FormCheckbox>

    <ModalWatermarkSettings
      v-if="showWatermarkSettings"
      @on-cancel="closeWatermarkSettings"
      @on-confirm="updateWatermarkSettings"
      :watermarkFrequency="watermarkFrequency"
      :watermarkDuration="watermarkDuration"
      :watermarkContent="watermarkContent" />
  </div>
</template>
<script>
import { bus } from "../main.js"

import EMPTY_FIELD from "@/const/emptyField"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import ModalWatermarkSettings from "./ModalWatermarkSettings.vue"

export default {
  props: {
    selectedChannel: {
      type: Object,
      required: true,
    },
    selectedTranslation: {
      type: String,
      default: "original",
    },
    displayLiveTranscription: {
      type: Boolean,
      default: true,
    },
    displaySubtitles: {
      type: Boolean,
      default: true,
    },
    displayWatermark: {
      type: Boolean,
      default: true,
    },
    fontSize: {
      type: String,
      default: "40",
    },
    channels: {
      type: Array,
      required: true,
    },
    qualifiedForCrossSubtitles: {
      type: Boolean,
      default: false,
    },
    watermarkFrequency: {
      type: Number,
      required: true,
    },
    watermarkDuration: {
      type: Number,
      required: true,
    },
    watermarkContent: {
      type: String,
      required: true,
    },
    displayWatermark: {
      type: Boolean,
      required: true,
    },
    watermarkPinned: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      fontSizeField: {
        ...EMPTY_FIELD,
        value: this.fontSize,
        label: this.$t("session.detail_page.font_size_label"),
        type: "number",
        customParams: {
          min: 12,
          max: 68,
        },
      },
      displaySubtitlesField: {
        ...EMPTY_FIELD,
        value: this.displaySubtitles,
        label: this.$t("session.detail_page.display_subtitles_label"),
      },
      displayLiveTranscriptionField: {
        ...EMPTY_FIELD,
        value: this.displayLiveTranscription,
        label: this.$t("session.detail_page.display_live_transcription_label"),
      },
      displayWatermarkField: {
        ...EMPTY_FIELD,
        value: this.displayWatermark,
        label: this.$t("session.detail_page.display_watermark_label"),
      },
      p_selectedTranslation: this.selectedTranslation,
      p_selectedChannel: this.selectedChannel,
      showWatermarkSettings: false,
    }
  },
  mounted() {},
  methods: {
    updateWatermarkSettings({ frequency, duration, text }) {
      this.$emit("update:watermarkFrequency", frequency)
      this.$emit("update:watermarkDuration", duration)
      this.$emit("update:watermarkContent", text)
      this.closeWatermarkSettings()
    },
    closeWatermarkSettings() {
      this.showWatermarkSettings = false
    },
    togglePin() {
      this.$emit("update:watermarkPinned", !this.watermarkPinned)
    },
  },
  computed: {
    hasTranslations() {
      return this.selectedChannel?.translations?.length > 0
    },
  },
  watch: {
    selectedTranslation(value) {
      this.p_selectedTranslation = value
    },
    selectedChannel(value) {
      this.p_selectedChannel = value
    },
    displayLiveTranscription(value) {
      this.displayLiveTranscriptionField.value = value
    },
    displaySubtitles(value) {
      this.displaySubtitlesField.value = value
    },
    displayWatermark(value) {
      this.displayWatermarkField.value = value
    },
    fontSize(value) {
      this.fontSizeField.value = value
    },
    p_selectedTranslation(value) {
      this.$emit("update:selectedTranslation", value)
    },
    p_selectedChannel(value) {
      this.$emit("update:selectedChannel", value)
    },
    "displayLiveTranscriptionField.value"(value) {
      this.$emit("update:displayLiveTranscription", value)
    },
    "displaySubtitlesField.value"(value) {
      this.$emit("update:displaySubtitles", value)
    },
    "fontSizeField.value"(value) {
      this.$emit("update:fontSize", value)
    },
    "displayWatermarkField.value"(value) {
      this.$emit("update:displayWatermark", value)
    },
  },
  components: {
    FormInput,
    FormCheckbox,
    SessionTranslationSelection,
    SessionChannelsSelector,
    ModalWatermarkSettings,
  },
}
</script>
