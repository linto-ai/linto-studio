<template>
  <div id="helper-container" class="flex col" v-if="showHelper">
    <div class="flex row helper-close">
      <button class="btn" @click="hide()">
        <span class="icon close"></span>
      </button>
    </div>

    <div class="flex col flex1 form-info-container" style="border: none">
      <span class="form-info-title">{{
        $t("conversation.organization_label")
      }}</span>
      <p class="form-info-content">
        {{ $t("conversation.organization_description") }}
      </p>

      <span class="form-info-title">{{ $t("conversation.name_label") }}</span>
      <p class="form-info-content">
        {{ $t("conversation.name_description") }}
      </p>

      <span class="form-info-title">{{
        $t("conversation.members_right_label")
      }}</span>
      <p class="form-info-content">
        {{ $t("conversation.members_right_description") }}
      </p>

      <span class="form-info-title">{{
        $t("conversation.transcription_service_label")
      }}</span>
      <p class="form-info-content">
        {{ $t("conversation.transcription_service_description") }}
      </p>

      <span class="form-info-title">{{
        $t("conversation.description_label")
      }}</span>
      <p class="form-info-content">
        {{ $t("conversation.description_description") }}
      </p>

      <span class="form-info-title">{{
        $t("conversation.media.type_label")
      }}</span>
      <ul class="form-info-list">
        <li>
          <strong>{{ $t("conversation.media.file_label_inline") }}</strong
          >{{ $t("conversation.media.file_description") }}
        </li>
        <li>
          <strong>{{ $t("conversation.media.microphone_label_inline") }}</strong
          >{{ $t("conversation.media.microphone_description") }}
        </li>
      </ul>

      <span class="form-info-title">{{
        $t("conversation.transcription_settings_label")
      }}</span>
      <ul class="form-info-list">
        <li>
          <strong>{{
            $t("conversation.transcription.diarization_label_inline")
          }}</strong
          >{{ $t("conversation.transcription.diarization_description") }}
        </li>
        <li>
          <strong>{{
            $t("conversation.transcription.punctuation_label_inline")
          }}</strong
          >{{ $t("conversation.transcription.punctuation_description") }}
        </li>
        <li>
          <strong>{{
            $t("conversation.transcription.normalization_label_inline")
          }}</strong
          >{{ $t("conversation.transcription.normalization_description") }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showHelper: { required: true },
  },
  data() {
    return {}
  },
  methods: {
    hide() {
      this.$emit("close")
    },
  },
}
</script>
