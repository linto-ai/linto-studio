<template>
  <div id="helper-container" class="flex col" v-if="showHelper">
    <div class="flex row helper-close">
      <button class="btn" @click="hide()">
        <span class="icon close"></span>
      </button>
    </div>

    <div class="flex col flex1 form-info-container" style="border: none">
      <span class="form-info-title">{{
        $t("conversation.transcription_help.edit_speaker_title")
      }}</span>
      <p class="form-info-content">
        {{ $tc("conversation.transcription_help.edit_speaker_content", 1) }}
      </p>
      <ul class="form-info-list">
        <li>
          {{
            $tc("conversation.transcription_help.edit_speaker_content_list", 1)
          }}
        </li>
        <li>
          {{
            $tc("conversation.transcription_help.edit_speaker_content_list", 2)
          }}
        </li>
      </ul>

      <span class="form-info-title">
        {{ $t("conversation.transcription_help.edit_transcript_title") }}
      </span>
      <p class="form-info-content">
        {{ $tc("conversation.transcription_help.edit_transcript_content", 1) }}
        <br />
        {{ $tc("conversation.transcription_help.edit_transcript_content", 2) }}
      </p>
      <div class="flex col form-info-sub-part">
        <span class="form-info-title lowercase">
          {{ $t("conversation.transcription_help.split_turn_title") }}
        </span>
        <p
          class="form-info-content"
          v-html="
            $t('conversation.transcription_help.split_turn_content', {
              html_icon: '',
            })
          "></p>

        <span class="form-info-title lowercase">
          {{ $t("conversation.transcription_help.merge_turn_title") }}
        </span>
        <p
          class="form-info-content"
          v-html="
            $tc('conversation.transcription_help.merge_turn_content', {
              html_icon: '',
            })
          "></p>
      </div>

      <span class="form-info-title">{{
        $t("conversation.transcription_help.filter_speaker_title")
      }}</span>
      <p class="form-info-content">
        {{ $t("conversation.transcription_help.filter_speaker_content") }}
      </p>

      <span class="form-info-title">
        {{ $t("conversation.transcription_help.audio_player_shortcut_title") }}
      </span>
      <p class="form-info-content">
        {{
          $tc(
            "conversation.transcription_help.audio_player_shortcut_content",
            1
          )
        }}<br />
        {{
          $tc(
            "conversation.transcription_help.audio_player_shortcut_content",
            2
          )
        }}
      </p>
      <ul class="form-info-list">
        <li
          v-for="i in 7"
          :key="i"
          v-html="
            $t('conversation.transcription_help.audio_player_shortcut_list' + i)
          "></li>
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
