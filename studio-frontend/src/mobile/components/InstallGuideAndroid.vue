<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.install.android_title')"
    @input="$emit('input', $event)">
    <p class="m-muted">{{ $t("mobile.install.android_intro") }}</p>
    <ol class="m-android-steps">
      <li
        v-for="(step, index) in steps"
        :key="step.icon"
        class="m-android-steps__item">
        <span class="m-android-steps__number">{{ index + 1 }}</span>
        <span class="m-android-steps__icon"
          ><PhIcon :name="step.icon" size="md"
        /></span>
        <span>{{ $t(step.text) }}</span>
      </li>
    </ol>
    <p class="m-muted">{{ $t("mobile.install.android_outro") }}</p>
    <button
      type="button"
      class="m-android-steps__done"
      @click="$emit('input', false)">
      {{ $t("mobile.install.understood") }}
    </button>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import { ANDROID_INSTALL_STEPS } from "@/mobile/const/androidInstallSteps.js"

// Shown when Chrome did not hand us its install prompt (already installed,
// prompt consumed, or not eligible): the manual path through the browser
// menu still works.
export default {
  name: "InstallGuideAndroid",
  components: { BottomSheet, PhIcon },
  props: {
    value: { type: Boolean, default: false },
  },
  computed: {
    steps() {
      return ANDROID_INSTALL_STEPS
    },
  },
}
</script>

<style scoped>
.m-android-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}

.m-android-steps__item {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
}

.m-android-steps__number {
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

.m-android-steps__icon {
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

.m-android-steps__done {
  min-height: var(--m-tap);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
  font-weight: 600;
}
</style>
