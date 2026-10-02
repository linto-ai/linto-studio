<template>
  <button type="button" class="template-card--create" @click="$emit('select')">
    <PhIcon :name="locked ? 'lock' : 'file-plus'" framed size="lg" />
    <span class="card-title">
      {{ $t("publish.publication.upload_template") }}
    </span>
    <span class="template-card--create__hint">{{ hint }}</span>
  </button>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import { lockedPlanHint } from "@/tools/lockedPlanHint.js"

// Upload entry of the template grid. Locked, it names the plan that unlocks it.
export default {
  name: "PublicationCreateTemplateCard",
  components: { PhIcon },
  props: {
    locked: { type: Boolean, default: false },
    // Cheapest plan with custom templates, null while the catalog loads
    lockedPlan: { type: Object, default: null },
  },
  computed: {
    hint() {
      if (!this.locked) return this.$t("publish.publication.upload_template_hint")
      return lockedPlanHint(this.$t.bind(this), this.lockedPlan)
    },
  },
}
</script>

<style lang="scss" scoped>
.template-card--create {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--small-gap);
  padding: var(--medium-gap);
  min-height: 11rem;
  background: var(--background-inset-section);
  border: var(--border-button);
  border-style: dashed;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font: inherit;
  color: var(--text-primary);
  text-align: center;
  white-space: normal;

  &:hover,
  &:focus-visible {
    border-color: var(--primary-color);
    background: var(--primary-soft);
  }
}

.template-card--create__hint {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
