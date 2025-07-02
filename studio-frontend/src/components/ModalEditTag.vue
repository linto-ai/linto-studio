<template>
  <ModalNew
    value
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="updateTag"
    :title="$t('manage_tags.edit_tag.title', { name: tag.name })"
    :actionBtnLabel="$t('manage_tags.edit_tag.save')"
    size="sm">
    <FormInput :field="name" v-model="name.value" />
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"

import { bus } from "@/main.js"
import EMPTY_FIELD from "@/const/emptyField"
import { apiUpdateTag } from "@/api/tag.js"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { formsMixin } from "@/mixins/forms.js"

import ModalNew from "@/components/molecules/Modal.vue"
import FormInput from "./molecules/FormInput.vue"

export default {
  mixins: [formsMixin],
  props: {
    tag: {
      type: Object,
      required: true,
    },
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
        value: this.tag.name,
        testField: testFieldEmpty,
        label: this.$t("manage_tags.edit_tag.name"),
      },
    }
  },
  mounted() {},
  methods: {
    async updateTag(event) {
      event?.preventDefault()
      if (this.testFields()) {
        const res = await apiUpdateTag(
          this.currentOrganizationScope,
          this.tag._id,
          {
            name: this.name.value,
          },
        )
        if (res.status == "error") {
          // TODO: handle other errors
          this.name.error = "Name already exist"
          return
        }
        this.$emit("on-confirm", {
          name: this.name.value,
          categoryId: this.tag.categoryId,
        })
      }
    },
  },
  components: { Fragment, ModalNew, FormInput },
}
</script>
