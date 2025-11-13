<template>
  <SelectorDescription v-model="_value" :readonly="readonly" :items="items" />
</template>

<script>
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import SelectorDescription from "./SelectorDescription.vue"
export default {
  mixins: [orgaRoleMixin],
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
        description: role.description,
        value: role.value,
      }))
    },
  },
  components: {
    SelectorDescription,
  },
}
</script>
