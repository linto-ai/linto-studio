<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="createCategory"
    :title="$t('manage_tags.create_category.title')"
    :actionBtnLabel="$t('manage_tags.create_category.save')"
    small>
    <FormInput :field="name" v-model="name.value" />
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"

import { bus } from "../main.js"
import EMPTY_FIELD from "@/const/emptyField"
import { apiCreateCategory } from "@/api/tag.js"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { formsMixin } from "@/mixins/forms.js"

import ModalNew from "./ModalNew.vue"
import FormInput from "../components/FormInput.vue"

export default {
  mixins: [formsMixin],
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fields: ["name"],
      name: {
        ...EMPTY_FIELD,
        value: "",
        testField: testFieldEmpty,
        label: this.$t("manage_tags.create_category.name"),
      },
    }
  },
  mounted() {},
  methods: {
    async createCategory(event) {
      event?.preventDefault()
      if (this.testFields()) {
        const res = await apiCreateCategory(
          this.currentOrganizationScope,
          this.name.value,
          "conversation_metadata",
          "organization",
          null
        )
        if (res.status == "error") {
          this.name.error = "Name already exist"
        } else {
          this.$emit("on-confirm", res)
        }
      }
    },
  },
  components: { Fragment, ModalNew, FormInput },
}
</script>
