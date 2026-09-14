<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.record.microphone_choose')"
    @input="$emit('input', $event)">
    <p v-if="!loaded" class="m-muted">{{ $t("mobile.common.loading") }}</p>
    <p v-else-if="microphones.length === 0" class="m-muted">
      {{ $t("mobile.record.microphone_permission") }}
    </p>
    <div v-else class="m-microphones">
      <ListRow
        :label="$t('mobile.record.microphone_default')"
        icon="microphone"
        :chevron="false"
        @click="$emit('choose', null)">
        <template #trailing>
          <PhIcon v-if="!currentId" name="check" size="md" weight="bold" />
        </template>
      </ListRow>
      <ListRow
        v-for="microphone in microphones"
        :key="microphone.deviceId"
        :label="microphone.label"
        icon="microphone"
        :chevron="false"
        @click="$emit('choose', microphone.deviceId)">
        <template #trailing>
          <PhIcon
            v-if="microphone.deviceId === currentId"
            name="check"
            size="md"
            weight="bold" />
        </template>
      </ListRow>
    </div>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"

export default {
  name: "MicrophoneSheet",
  components: { BottomSheet, ListRow, PhIcon },
  props: {
    value: { type: Boolean, default: false },
    microphones: { type: Array, required: true },
    loaded: { type: Boolean, default: false },
    currentId: { type: String, default: null },
  },
}
</script>

<style scoped>
.m-microphones {
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}
</style>
