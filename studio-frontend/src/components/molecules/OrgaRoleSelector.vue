<template>
  <Popover
    close-on-click-outside
    close-on-escape
    overlay
    v-if="!readonly"
    ref="popover">
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
  <Tooltip v-else text="toto" maxWidth="400px" position="bottom">
    <div class="role-selector-container--readonly">
      {{ currentRole.name }}
    </div>
    <template #content>
      <OrgaRoleSelectorContent v-model="_value" :readonly="readonly" />
    </template>
  </Tooltip>
</template>

<script>
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import OrgaRoleSelectorContent from "./OrgaRoleSelectorContent.vue"
import Tooltip from "../atoms/Tooltip.vue"
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
        this.$refs.popover && this.$refs.popover.close()
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

.role-selector-container--readonly {
  position: relative;

  .role-selector {
    display: none;
    position: absolute;
    background-color: white;
    border: 1px solid;
  }

  &:hover {
    .role-selector {
      display: grid;
    }
  }
}
</style>
