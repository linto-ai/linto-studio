<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.live.end_title')"
    @input="$emit('input', $event)">
    <p class="m-muted">{{ $t("mobile.live.end_text") }}</p>
    <form class="m-end-live" @submit.prevent="$emit('confirm', name)">
      <label class="m-end-live__field">
        <span>{{ $t("mobile.record.name") }}</span>
        <input v-model="name" type="text" required maxlength="200" />
      </label>
      <button type="submit" class="m-end-live__confirm" :disabled="busy">
        {{ busy ? $t("mobile.common.loading") : $t("mobile.live.stop") }}
      </button>
      <button
        type="button"
        class="m-end-live__cancel"
        @click="$emit('input', false)">
        {{ $t("mobile.live.keep_going") }}
      </button>
    </form>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"

export default {
  name: "EndLiveSheet",
  components: { BottomSheet },
  props: {
    value: { type: Boolean, default: false },
    defaultName: { type: String, required: true },
    busy: { type: Boolean, default: false },
  },
  data() {
    return { name: this.defaultName }
  },
  watch: {
    defaultName(value) {
      this.name = value
    },
  },
}
</script>

<style scoped>
.m-end-live {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-end-live__field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-end-live__field input {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-end-live__confirm {
  min-height: 52px;
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-danger);
  color: var(--m-on-primary);
  font-weight: 600;
}

.m-end-live__cancel {
  min-height: var(--m-tap);
  border: none;
  background: transparent;
  color: var(--m-primary);
  font-weight: 600;
}
</style>
