<template>
  <div class="flex col flex1 justify-center align-center reset-overflows">
    <div id="version-list" class="small-margin">
      <div class="center-text">
        <h2 v-if="subtitleAvailable">
          {{ $t("conversation.subtitles.available") }}
        </h2>
        <h2 v-else>{{ $t("conversation.subtitles.not_available") }}</h2>
      </div>
      <ul class="subtitle-list flex col gap-medium">
        <li
          v-for="version of conversation.subtitleVersions"
          class="flex"
          :key="version._id">
          <input
            type="checkbox"
            name="version-selection"
            :value="version._id"
            v-model="selectedVersions"
            class="conversation-line__checkbox" />
          <SubtitleVersionLine
            :conversation="conversation"
            :version="version"
            :canEdit="canEdit"></SubtitleVersionLine>
        </li>
      </ul>
    </div>
    <GenerateSubtitleButton
      v-if="!subtitleAvailable"
      :canEdit="canEdit"></GenerateSubtitleButton>
  </div>
</template>
<script>
import GenerateSubtitleButton from "./GenerateSubtitleButton.vue"
import SubtitleVersionLine from "./SubtitleVersionLine.vue"
export default {
  props: {
    value: {
      type: Array,
    },
    conversation: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    userRight: {
      type: Number,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    selectedVersions: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
    subtitleAvailable() {
      return this.conversation.subtitleVersions.length != 0
    },
  },
  components: {
    GenerateSubtitleButton,
    SubtitleVersionLine,
  },
}
</script>
