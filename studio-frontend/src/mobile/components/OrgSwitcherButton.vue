<template>
  <button
    type="button"
    class="m-org-switcher"
    :aria-label="$t('mobile.organization.switch')"
    @click="$emit('click')">
    <span class="m-org-switcher__avatar" aria-hidden="true">{{
      initials
    }}</span>
    <span class="m-org-switcher__text">
      <span class="m-org-switcher__name">{{ organizationName }}</span>
      <span v-if="roleLabel" class="m-org-switcher__role">{{ roleLabel }}</span>
    </span>
    <PhIcon name="caret-up-down" size="sm" weight="bold" />
  </button>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "OrgSwitcherButton",
  components: { PhIcon },
  props: {
    organizationName: { type: String, required: true },
    roleLabel: { type: String, default: "" },
    initials: { type: String, default: "" },
  },
}
</script>

<style scoped>
.m-org-switcher {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  min-height: var(--m-tap);
  min-width: 0;
  padding: 0 var(--m-space-1) 0 0;
  border: none;
  background: transparent;
  text-align: left;
  color: var(--m-text-muted);
}

.m-org-switcher__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
  font-size: var(--m-font-size-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-org-switcher__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.m-org-switcher__name {
  font-weight: 600;
  color: var(--m-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-org-switcher__role {
  font-size: var(--m-font-size-sm);
}
</style>
