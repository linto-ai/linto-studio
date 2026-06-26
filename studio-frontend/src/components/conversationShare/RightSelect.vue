<template>
  <SelectorDescription
    :value="effectiveValue"
    :readonly="readonly"
    :items="items"
    @input="onInput" />
</template>

<script>
import SelectorDescription from "@/components/molecules/SelectorDescription.vue"
import RIGHTS_LIST from "@/const/rigthsList.js"

const MULTIPLE_VALUE = -1

export default {
  name: "RightSelect",
  components: { SelectorDescription },
  props: {
    value: { type: Number, required: true },
    readonly: { type: Boolean, default: false },
    withMultiple: { type: Boolean, default: false },
  },
  computed: {
    isMultiple() {
      return this.value === MULTIPLE_VALUE
    },
    effectiveValue() {
      return this.isMultiple ? MULTIPLE_VALUE : this.value
    },
    items() {
      const list = RIGHTS_LIST((key) => this.$i18n.t(key)).map((item) => ({
        name: item.txt,
        value: item.value,
        description: this.descriptionFor(item.value),
      }))
      if (this.withMultiple || this.isMultiple) {
        list.unshift({
          name: this.$i18n.t("conversation.members_right_txt.mutiple_values"),
          value: MULTIPLE_VALUE,
          description: "",
        })
      }
      return list
    },
  },
  methods: {
    descriptionFor(value) {
      const map = {
        0: "conversation.members_right_desc.none",
        1: "conversation.members_right_desc.read",
        3: "conversation.members_right_desc.comment",
        7: "conversation.members_right_desc.write",
        23: "conversation.members_right_desc.share",
        31: "conversation.members_right_desc.full_rights",
      }
      const key = map[value]
      const translated = this.$i18n.t(key)
      return translated === key ? "" : translated
    },
    onInput(value) {
      if (value === MULTIPLE_VALUE) return
      this.$nextTick(() => {
        this.$emit("input", value)
      })
    },
  },
}
</script>
