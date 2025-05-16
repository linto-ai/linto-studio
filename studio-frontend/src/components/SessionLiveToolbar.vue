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
      v-model="displaySubtitlesField.value">
      <template v-slot:content-after-label>
        <!-- <button class="only-icon transparent">
          <span class="icon clear-history" />
        </button> -->
      </template>
    </FormCheckbox>
    <div
      class="subSection flex col gap-small"
      v-if="displaySubtitlesField.value">
      <FormInput :field="fontSizeField" v-model="fontSizeField.value" />

      <FormCheckbox
        v-if="enableWatermark && isAtLeastMeetingManager && !quickSession"
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
            :aria-label="
              $t('session.live_page.watermark_settings.unpin_button')
            "
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

      <button @click="clearSubtitles">
        <span class="icon clear-history" />
        <span class="label">{{ $t("session.live_page.clear_subtitle") }}</span>
      </button>
      <ModalWatermarkSettings
        v-if="showWatermarkSettings"
        @on-cancel="closeWatermarkSettings"
        @on-confirm="closeWatermarkSettings"
        :field="watermarkSettingsField"
        v-model="watermarkSettingsField.value" />
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"

import EMPTY_FIELD from "@/const/emptyField"
import { getEnv } from "@/tools/getEnv"
import { orgaRoleMixin } from "@/mixins/orgaRole"

import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import ModalWatermarkSettings from "@/components/ModalWatermarkSettings.vue"

export default {
  mixins: [orgaRoleMixin],
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
      required: false,
    },
    watermarkDuration: {
      type: Number,
      required: false,
    },
    watermarkContent: {
      type: String,
      required: false,
    },
    displayWatermark: {
      type: Boolean,
      required: false,
    },
    watermarkPinned: {
      type: Boolean,
      required: false,
    },
    quickSession: {
      type: Boolean,
      default: false,
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
      watermarkSettingsField: {
        ...EMPTY_FIELD,
        value: {
          frequency: this.watermarkFrequency,
          duration: this.watermarkDuration,
          content: this.watermarkContent,
        },
      },
      p_selectedTranslation: this.selectedTranslation,
      p_selectedChannel: this.selectedChannel,
      showWatermarkSettings: false,
    }
  },
  mounted() {},
  methods: {
    // updateWatermarkSettings({ frequency, duration, text }) {
    //   this.$emit("updateWatermarkSettings", {
    //     frequency,
    //     duration,
    //     text,
    //     pinned: this.watermarkPinned,
    //     display: this.displayWatermarkField.value,
    //   })
    //   this.closeWatermarkSettings()
    // },
    closeWatermarkSettings() {
      this.showWatermarkSettings = false
    },
    togglePin() {
      this.$emit("updateWatermarkSettings", {
        frequency: this.watermarkFrequency,
        duration: this.watermarkDuration,
        text: this.watermarkContent,
        pinned: !this.watermarkPinned,
        display: this.displayWatermarkField.value,
      })
    },
    clearSubtitles() {
      bus.$emit("clear-session-subtitles")
    },
  },
  computed: {
    hasTranslations() {
      return this.selectedChannel?.translations?.length > 0
    },
    enableWatermark() {
      return getEnv("VUE_APP_ENABLE_WATERMARK") === "true"
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
    watermarkFrequency(value) {
      this.watermarkSettingsField.value.frequency = value
    },
    watermarkDuration(value) {
      this.watermarkSettingsField.value.duration = value
    },
    watermarkContent(value) {
      this.watermarkSettingsField.value.content = value
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
      this.$emit("updateWatermarkSettings", {
        frequency: this.watermarkFrequency,
        duration: this.watermarkDuration,
        content: this.watermarkContent,
        pinned: !this.watermarkPinned,
        display: value,
      })
    },
    "watermarkSettingsField.value"(value) {
      this.$emit("updateWatermarkSettings", {
        frequency: value.frequency,
        duration: value.duration,
        content: value.content,
        pinned: this.watermarkPinned,
        display: this.displayWatermarkField.value,
      })
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
