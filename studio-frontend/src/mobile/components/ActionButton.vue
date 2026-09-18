<template>
  <component
    :is="disabled ? 'div' : 'router-link'"
    :to="disabled ? undefined : to"
    class="m-action"
    :class="{ 'm-action--disabled': disabled }"
    :aria-disabled="disabled ? 'true' : null">
    <span class="m-action__icon">
      <PhIcon :name="icon" size="lg" />
    </span>
    <span class="m-action__text">
      <span class="m-action__title">
        {{ title }}
        <slot name="badge" />
      </span>
      <span class="m-action__subtitle">{{ subtitle }}</span>
    </span>
    <PhIcon
      v-if="!disabled"
      name="caret-right"
      size="md"
      class="m-action__chevron" />
  </component>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// One of the three big home actions. Disabled state keeps the subtitle as
// the place where the reason is written (color alone is never the signal).
export default {
  name: "ActionButton",
  components: { PhIcon },
  props: {
    to: { type: [String, Object], required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.m-action {
  display: flex;
  align-items: center;
  gap: var(--m-space-4);
  min-height: 96px;
  padding: 0 var(--m-space-4) 0 var(--m-space-5);
  border-radius: 16px;
  background: var(--m-surface);
  box-shadow: var(--m-shadow-2);
  color: var(--m-text);
  text-decoration: none;
}

.m-action:active {
  background: var(--m-surface-muted);
}

.m-action--disabled {
  color: var(--m-text-muted);
  background: var(--m-surface-muted);
  box-shadow: none;
}

.m-action__icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--m-primary-soft);
  color: var(--m-primary);
}

.m-action--disabled .m-action__icon {
  background: var(--m-divider);
  color: var(--m-text-muted);
}

.m-action__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-action__title {
  font-size: 17px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
}

.m-action__subtitle {
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-action__chevron {
  color: var(--m-text-muted);
  flex-shrink: 0;
}
</style>
