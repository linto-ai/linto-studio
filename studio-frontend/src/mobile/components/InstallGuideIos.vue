<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.install.ios_title')"
    @input="$emit('input', $event)">
    <p class="m-muted">{{ $t("mobile.install.ios_intro") }}</p>
    <ol class="m-ios-steps">
      <li
        v-for="(step, index) in steps"
        :key="step.icon"
        class="m-ios-steps__item">
        <span class="m-ios-steps__number">{{ index + 1 }}</span>
        <span class="m-ios-steps__icon"
          ><PhIcon :name="step.icon" size="md"
        /></span>
        <span>{{ $t(step.text) }}</span>
      </li>
    </ol>
    <p class="m-muted">{{ $t("mobile.install.ios_outro") }}</p>
    <button
      type="button"
      class="m-ios-steps__done"
      @click="$emit('input', false)">
      {{ $t("mobile.install.understood") }}
    </button>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import { IOS_INSTALL_STEPS } from "@/mobile/const/iosInstallSteps.js"

// iOS has no install API: the only path is Share > Add to Home Screen.
export default {
  name: "InstallGuideIos",
  components: { BottomSheet, PhIcon },
  props: {
    value: { type: Boolean, default: false },
  },
  computed: {
    steps() {
      return IOS_INSTALL_STEPS
    },
  },
}
</script>

<style scoped>
.m-ios-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}

.m-ios-steps__item {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
}

.m-ios-steps__number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-size: var(--m-font-size-sm);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-ios-steps__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--m-radius-sm);
  border: 1px solid var(--m-border);
  background: var(--m-surface-muted);
  color: var(--m-info);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-ios-steps__done {
  min-height: var(--m-tap);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
  font-weight: 600;
}
</style>
