<template>
  <span class="count-badge">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: "CountBadge",
}
</script>

<style lang="scss" scoped>
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  border-radius: 999px;
  background: var(--neutral-10);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
