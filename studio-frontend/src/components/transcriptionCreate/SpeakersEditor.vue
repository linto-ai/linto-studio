<template>
  <TranscriptionCreateFrame
    withBack
    :title="$t('transcription_create.speakers.title')"
    @back="$emit('cancel')"
    @close="$emit('close')"
    @submit="$emit('apply', { mode, collectionId: appliedCollectionId })">
    <div class="flex col gap-small">
      <template v-for="option in options">
        <RadioCard
          :key="option.name"
          v-model="mode"
          name="transcription-speakers"
          :choiceValue="option.name"
          :disabled="option.disabled"
          :label="$t(`transcription_create.speakers.${option.name}.label`)"
          :description="
            $t(`transcription_create.speakers.${option.name}.description`)
          " />
        <div
          v-if="option.name === 'recognize' && mode === 'recognize'"
          :key="`${option.name}-collection`"
          class="speakers-editor__collection form-field flex col gap-tiny">
          <label for="transcription-speakers-collection">
            {{ $t("transcription_create.speakers.collection_label") }}
          </label>
          <select
            id="transcription-speakers-collection"
            v-model="collectionId"
            class="fullwidth">
            <option
              v-for="collection in collections"
              :key="collection._id"
              :value="collection._id">
              {{ collection.name }}
            </option>
          </select>
        </div>
        <small
          v-if="option.notice && (option.disabled || mode === option.name)"
          :key="`${option.name}-notice`"
          class="speakers-editor__notice">
          {{ $t(`transcription_create.speakers.notices.${option.notice}`) }}
        </small>
      </template>
    </div>
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
import { computeDefaultCollectionId } from "@/tools/transcriptionCreate/computeDefaultCollectionId.js"
import RadioCard from "./RadioCard.vue"
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"

export default {
  name: "SpeakersEditor",
  components: { RadioCard, TranscriptionCreateFrame },
  props: {
    // draft.speakers
    value: { type: Object, required: true },
    // See computeSpeakerOptions
    options: { type: Array, required: true },
    collections: { type: Array, required: true },
  },
  data() {
    return {
      mode: this.value.mode,
      collectionId:
        this.value.collectionId ?? computeDefaultCollectionId(this.collections),
    }
  },
  computed: {
    appliedCollectionId() {
      return this.mode === "recognize" ? this.collectionId : null
    },
  },
}
</script>
<style lang="scss" scoped>
.speakers-editor__collection {
  padding-left: var(--large-gap);
}

.speakers-editor__notice {
  margin-left: var(--large-gap);
  color: var(--text-secondary);
}
</style>
