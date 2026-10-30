<template>
  <div class="m-install">
    <PhIcon name="device-mobile" size="lg" class="m-install__icon" />
    <div class="m-install__text">
      <span class="m-install__title">{{ $t("mobile.install.title") }}</span>
      <span class="m-muted">{{ $t("mobile.install.subtitle") }}</span>
    </div>
    <Button
      variant="primary"
      :label="$t('mobile.install.button')"
      @click="$emit('install')" />
    <Button
      variant="transparent"
      icon="x"
      class="m-install__dismiss"
      :aria-label="$t('mobile.install.dismiss')"
      @click="$emit('dismiss')" />
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

.m-install__dismiss {
  --btn-text: var(--m-text-muted);
}
</style>
