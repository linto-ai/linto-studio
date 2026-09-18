<template>
  <header class="m-app-header">
    <OrgSwitcherButton
      :organization-name="organizationName"
      :role-label="roleLabel"
      :initials="initials"
      @click="$emit('open-organizations')" />
    <IconButton
      icon="gear"
      :label="$t('mobile.account.title')"
      @click="$emit('open-account')" />
  </header>
</template>

<script>
import OrgSwitcherButton from "@/mobile/components/OrgSwitcherButton.vue"
import IconButton from "@/mobile/components/IconButton.vue"

// Home header: current organization on the left, account on the right.
export default {
  name: "AppHeader",
  components: { OrgSwitcherButton, IconButton },
  props: {
    organizationName: { type: String, required: true },
    roleLabel: { type: String, default: "" },
    initials: { type: String, default: "" },
  },
}
</script>

<style scoped>
.m-app-header {
  height: var(--m-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-space-2);
  padding: 0 var(--m-space-2) 0 var(--m-space-3);
}
</style>
