<template>
  <TranscriptionCreateFrame
    withBack
    :title="$t('transcription_create.summary.visio_subtitles')"
    @back="$emit('cancel')"
    @close="$emit('close')"
    @submit="$emit('apply', { showSubtitles, subtitleSource })">
    <FormCheckbox :field="showSubtitlesField" v-model="showSubtitles" />
    <SessionTranslationSelection
      v-if="showSubtitles"
      v-model="subtitleSource"
      :selectedChannel="{ translations }"
      :customLabel="$t('quick_session.setup_visio.bot_lang_label')" />
    <template #footer>
      <Button type="button" variant="text" @click="$emit('cancel')">
        {{ $t("transcription_create.cancel") }}
      </Button>
      <Button type="submit" variant="primary">
        {{ $t("transcription_create.apply") }}
      </Button>
    </template>
  </TranscriptionCreateFrame>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField.js"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"

export default {
  name: "VisioSubtitlesEditor",
  components: {
    SessionTranslationSelection,
    FormCheckbox,
    TranscriptionCreateFrame,
  },
  props: {
    // draft.visio
    value: { type: Object, required: true },
    // draft.translations
    translations: { type: Array, required: true },
  },
  data() {
    return {
      showSubtitles: this.value.showSubtitles,
      subtitleSource: this.value.subtitleSource,
      showSubtitlesField: {
        ...EMPTY_FIELD,
        label: this.$t(
          "quick_session.setup_visio.display_transcription_in_visio_label",
        ),
      },
    }
  },
}
</script>
