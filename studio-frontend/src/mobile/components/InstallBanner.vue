<template>
  <div class="m-install">
    <PhIcon name="device-mobile" size="lg" class="m-install__icon" />
    <div class="m-install__text">
      <span class="m-install__title">{{ $t("mobile.install.title") }}</span>
      <span class="m-muted">{{ $t("mobile.install.subtitle") }}</span>
    </div>
    <button type="button" class="m-install__button" @click="$emit('install')">
      {{ $t("mobile.install.button") }}
    </button>
    <button
      type="button"
      class="m-install__dismiss"
      :aria-label="$t('mobile.install.dismiss')"
      @click="$emit('dismiss')">
      <PhIcon name="x" size="sm" />
    </button>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "InstallBanner",
  components: { PhIcon },
}
</script>

<style scoped>
.m-install {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  padding: var(--m-space-3) var(--m-space-2) var(--m-space-3) var(--m-space-4);
  border-radius: var(--m-radius);
  border: 1px solid var(--m-primary);
  background: var(--m-primary-soft);
}

.m-install__icon {
  color: var(--m-primary);
  flex-shrink: 0;
}

.m-install__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-install__title {
  font-weight: 600;
  color: var(--m-primary);
}

.m-install__button {
  min-height: var(--m-tap);
  padding: 0 var(--m-space-3);
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
}

.m-install__dismiss {
  width: var(--m-tap);
  height: var(--m-tap);
  border: none;
  background: transparent;
  color: var(--m-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
