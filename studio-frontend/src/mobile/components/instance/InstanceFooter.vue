<template>
  <footer class="m-instance-footer">
    <PhIcon name="hard-drives" size="sm" />
    <span class="m-instance-footer__address">{{ address }}</span>
    <span aria-hidden="true">·</span>
    <Button
      variant="link"
      size="sm"
      :label="$t('mobile.instance.change')"
      @click="$emit('change')" />
  </footer>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Bottom bar of the native app's login page: the instance in use and the
// way to change it. Sticky, so it stays in view when the page scrolls.
export default {
  name: "InstanceFooter",
  components: { PhIcon },
  props: {
    address: { type: String, required: true },
  },
}
</script>

<style scoped>
.m-instance-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--m-space-2);
  min-height: var(--m-tap);
  padding: var(--m-space-1) var(--m-space-4)
    calc(var(--m-space-1) + var(--m-safe-bottom));
  border-top: 1px solid var(--m-divider);
  background: var(--m-bg);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-instance-footer__address {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
}
</style>
