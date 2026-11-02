<template>
  <TranscriptionCreateFrame
    withBack
    :title="title"
    @back="$emit('cancel')"
    @close="$emit('close')"
    @submit="$emit('apply', selected)">
    <p class="engine-editor__description">
      {{ $t("transcription_create.engine.description") }}
    </p>
    <div class="flex col gap-small">
      <RadioCard
        v-for="engine in engines"
        :key="engine.id"
        v-model="selected"
        name="transcription-engine"
        :choiceValue="engine.id"
        :label="engine.name"
        :description="engine.languages" />
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
import RadioCard from "./RadioCard.vue"
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"

export default {
  name: "EngineEditor",
  components: { RadioCard, TranscriptionCreateFrame },
  props: {
    title: { type: String, required: true },
    // [{ id, name, languages }]
    engines: { type: Array, required: true },
    value: { type: String, default: null },
  },
  data() {
    return {
      selected: this.value,
    }
  },
}
</script>
<style lang="scss" scoped>
.engine-editor__description {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
