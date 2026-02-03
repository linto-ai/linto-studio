<template>
  <div class="plaform-role-container" v-if="readonly">
    <Tooltip
      class="plaform-role-tooltip"
      v-for="role in platformRoles"
      :text="role.description"
      v-if="value & role.value && (!compact || role.value * 2 > value)">
      <div class="plaform-role">
        {{ role.name }}
      </div>
    </Tooltip>
  </div>
  <div v-else class="flex col gap-small form-field">
    <label v-if="field.label" class="form-field-label">{{ field.label }}</label>
    <FormCheckbox
      :field="organization_initiator_field"
      :disabled="super_administrator_field.value"
      v-model="organization_initiator_field.value" />
    <FormCheckbox
      :field="session_operator_field"
      :disabled="super_administrator_field.value"
      v-model="session_operator_field.value" />
    <FormCheckbox
      :field="system_administrator_field"
      :disabled="super_administrator_field.value"
      v-model="system_administrator_field.value" />
    <FormCheckbox
      :field="super_administrator_field"
      v-model="super_administrator_field.value" />
  </div>
</template>

<script>
import { platformRoleMixin } from "@/mixins/platformRole"

import SelectorDescription from "./SelectorDescription.vue"
import Chip from "../atoms/Chip.vue"
import Tooltip from "../atoms/Tooltip.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"

export default {
  mixins: [platformRoleMixin],
  props: {
    value: {
      type: Number,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    field: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      organization_initiator_field: {
        label: this.$t("platform_role.organization_initiator"),
        value: false,
        error: null,
        disabled: false,
      },
      session_operator_field: {
        label: this.$t("platform_role.session_operator"),
        value: false,
        error: null,
        disabled: false,
      },
      system_administrator_field: {
        label: this.$t("platform_role.system_administrator"),
        value: false,
        error: null,
        disabled: false,
      },
      super_administrator_field: {
        label: this.$t("platform_role.super_administrator"),
        value: false,
        error: null,
        disabled: false,
      },
    }
  },
  watch: {
    value: {
      handler(platformRole) {
        this.organization_initiator_field.value =
          this.roleIsOrganizationInitiator(platformRole)
        this.session_operator_field.value =
          this.roleIsSessionOperator(platformRole)
        this.system_administrator_field.value =
          this.roleIsSystemAdministrator(platformRole)
        this.super_administrator_field.value =
          this.roleIsSuperAdministrator(platformRole)
      },
      immediate: true,
    },
    "organization_initiator_field.value"() {
      this.computeValue()
    },
    "session_operator_field.value"() {
      this.computeValue()
    },
    "system_administrator_field.value"() {
      this.computeValue()
    },
    "super_administrator_field.value"(admin_value) {
      if (admin_value) {
        const allValues = Object.values(this.roles_dict).reduce(
          (acc, value) => acc + value,
          0,
        )
        this.$emit("input", allValues)
      } else {
        this.computeValue()
      }
    },
  },
  methods: {
    computeValue() {
      const value = this.computeRoleValue({
        USER: true,
        ORGANIZATION_INITIATOR: this.organization_initiator_field.value,
        SESSION_OPERATOR: this.session_operator_field.value,
        SYSTEM_ADMINISTRATOR: this.system_administrator_field.value,
        SUPER_ADMINISTRATOR: this.super_administrator_field.value,
      })
      this.$emit("input", value)
    },
  },
  computed: {
    items() {
      return this.platformRoles.map((role) => ({
        name: role.name,
        description: role.description,
        value: role.value,
      }))
    },
  },
  components: {
    SelectorDescription,
    FormCheckbox,
  },
}
</script>

<style lang="scss" scoped>
.plaform-role-container {
  width: 100%;
}

.plaform-role {
  display: inline-block;
  border: 1px solid var(--neutral-30);
  margin-left: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 50px;
  padding: 0 0.5rem;
  background-color: var(--background-primary);
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.plaform-role-tooltip:first-child .plaform-role {
  margin-left: 0;
}

.plaform-role-tooltip:last-child .plaform-role {
  margin-bottom: 0;
}
</style>
