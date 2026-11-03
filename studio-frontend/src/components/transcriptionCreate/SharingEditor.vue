<template>
  <TranscriptionCreateFrame
    withBack
    :title="$t('transcription_create.summary.sharing')"
    @back="$emit('cancel')"
    @close="$emit('close')"
    @submit="$emit('apply', selected)">
    <div class="flex col gap-small">
      <RadioCard
        v-for="right in rights"
        :key="right.value"
        v-model="selected"
        name="transcription-sharing"
        :choiceValue="right.value"
        :label="right.txt" />
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
import RIGHTS_LIST from "@/const/rigthsList"
import RadioCard from "./RadioCard.vue"
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"

export default {
  name: "SharingEditor",
  components: { RadioCard, TranscriptionCreateFrame },
  props: {
    // draft.membersRight
    value: { type: Number, required: true },
  },
  data() {
    return {
      selected: this.value,
      rights: RIGHTS_LIST(this.$t.bind(this)),
    }
  },
}
</script>
