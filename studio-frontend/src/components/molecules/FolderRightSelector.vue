<template>
  <SelectorDescription v-model="_value" :readonly="readonly" :items="items" />
</template>

<script>
import SelectorDescription from "./SelectorDescription.vue"

export default {
  components: { SelectorDescription },
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
      return [
        {
          name: this.$t("folders.right_none"),
          description: this.$t("folders.right_none_description"),
          value: 0,
        },
        {
          name: this.$t("folders.right_read"),
          description: this.$t("folders.right_read_description"),
          value: 1,
        },
        {
          name: this.$t("folders.right_write"),
          description: this.$t("folders.right_write_description"),
          value: 5,
        },
        {
          name: this.$t("folders.right_share"),
          description: this.$t("folders.right_share_description"),
          value: 21,
        },
      ]
    },
  },
}
</script>
