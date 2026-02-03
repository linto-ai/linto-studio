<template>
  <div class="panel" :class="[variant, { 'panel--no-padding': noPadding }]">
    <div v-if="title" class="panel__header">
      <span class="panel__title">{{ title }}</span>
      <slot name="header-actions"></slot>
    </div>
    <div class="panel__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Panel",
  props: {
    title: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "default",
      validator: (v) => ["default", "dark"].includes(v),
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  border: var(--border-block);
  border-radius: 8px;
  overflow: hidden;
  background: var(--background-primary);
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--small-gap) var(--medium-gap);
  background: var(--neutral-10);
  border-bottom: var(--border-block);
  flex-shrink: 0;
}

.panel__title {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.panel__body {
  flex: 1;
  padding: var(--medium-gap);
  overflow-y: auto;
}

.panel--no-padding .panel__body {
  padding: 0;
  overflow: hidden;
}

/* Dark variant for JSON editor */
.panel.dark .panel__header {
  background: var(--neutral-90);
  border-bottom-color: var(--neutral-80);
}

.panel.dark .panel__title {
  color: var(--neutral-40);
}

.panel.dark .panel__body {
  background: var(--neutral-100);
}
</style>
