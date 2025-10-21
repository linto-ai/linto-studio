<template>
  <Popover close-on-click-outside close-on-escape overlay>
    <template #trigger="{ open }">
      <slot name="trigger" :open="open">
        <Button
          :iconRight="open ? 'caret-up' : 'caret-down'"
          :label="currentRole.name" />
      </slot>
    </template>
    <template #content>
      <OrgaRoleSelectorContent v-model="_value" :readonly="readonly" />
    </template>
  </Popover>
</template>

<script>
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import OrgaRoleSelectorContent from "./OrgaRoleSelectorContent.vue"
export default {
  mixins: [orgaRoleMixin, platformRoleMixin],
  props: {
    value: {
      type: Number,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "updateUserRole"],
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    items() {
      return this.userRoles.map((role) => ({
        name: role.name,
        //description: role.description,
        value: role.value,
      }))
    },
    currentRole() {
      return this.userRoles.find((ur) => ur.value === this.value)
    },
  },
  components: {
    OrgaRoleSelectorContent,
  },
}
</script>

<style lang="css">
.role_name {
  font-weight: 500;
}

.role_description {
  color: var(--text-secondary);
  font-size: 0.9em;
}
</style>
