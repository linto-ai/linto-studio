<template>
  <component
    :is="tag"
    class="m-list-row"
    :class="{ 'm-list-row--danger': danger }"
    v-bind="attributes"
    v-on="$listeners">
    <PhIcon v-if="icon" :name="icon" size="md" class="m-list-row__icon" />
    <span class="m-list-row__body">
      <span class="m-list-row__label">{{ label }}</span>
      <span v-if="hint" class="m-list-row__hint">{{ hint }}</span>
    </span>
    <slot name="trailing">
      <PhIcon
        v-if="chevron"
        name="caret-right"
        size="sm"
        class="m-list-row__chevron" />
    </slot>
  </component>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// One tappable row of a list or sheet: a button by default, a link when
// `href` is given, a router-link when `to` is given.
export default {
  name: "ListRow",
  components: { PhIcon },
  props: {
    label: { type: String, required: true },
    hint: { type: String, default: "" },
    icon: { type: String, default: "" },
    chevron: { type: Boolean, default: true },
    danger: { type: Boolean, default: false },
    href: { type: String, default: "" },
    to: { type: [String, Object], default: null },
  },
  computed: {
    tag() {
      if (this.to) return "router-link"
      if (this.href) return "a"
      return "button"
    },
    attributes() {
      if (this.to) return { to: this.to }
      if (this.href)
        return { href: this.href, target: "_blank", rel: "noopener" }
      return { type: "button" }
    },
  },
}
</script>

<style scoped>
.m-list-row {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  width: 100%;
  min-height: 52px;
  padding: var(--m-space-2) var(--m-space-4);
  border: none;
  border-bottom: 1px solid var(--m-divider);
  background: var(--m-surface);
  color: var(--m-text);
  text-align: left;
  text-decoration: none;
}

.m-list-row:last-child {
  border-bottom: none;
}

.m-list-row:active {
  background: var(--m-surface-muted);
}

.m-list-row--danger {
  color: var(--m-danger);
}

.m-list-row__icon {
  flex-shrink: 0;
}

.m-list-row__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-list-row__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-list-row__hint {
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-list-row__chevron {
  color: var(--m-text-muted);
  flex-shrink: 0;
}
</style>
