<template>
  <ModalNew
    small
    isForm
    deleteButton
    @on-delete="deleteHandler"
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="confirm"
    :title="$t('session.settings_page.modal_edit_session_alias.title')"
    :actionBtnLabel="
      $t('session.settings_page.modal_edit_session_alias.confirm_button')
    ">
    <FormInput v-model="nameField.value" :field="nameField"> </FormInput>

    <LabeledValue
      :label="$t('session.settings_page.modal_edit_session_alias.link_label')"
      :value="`Studio.linto.app/6785238f0aee1be21684a9e1/sessions/${nameField.value}`" />
  </ModalNew>
</template>
<script>
import { bus } from "@/main.js"
import ModalNew from "@/components/ModalNew.vue"
import FormInput from "./FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import LabeledValue from "@/components/LabeledValue.vue"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { formsMixin } from "@/mixins/forms.js"

export default {
  mixins: [formsMixin],
  props: {},
  data() {
    return {
      nameField: {
        ...EMPTY_FIELD,
        label: this.$t(
          "session.settings_page.modal_edit_session_alias.name_label",
        ),
        testField: testFieldEmpty,
      },
      fields: ["nameField"],
    }
  },
  mounted() {},
  methods: {
    confirm(e) {
      e?.preventDefault()
      if (this.testFields()) {
        this.$emit("on-confirm", this.nameField.value)
      }
      return false
    },
    deleteHandler() {
      this.$emit("on-delete")
    },
  },
  components: {
    ModalNew,
    LabeledValue,
    FormInput,
  },
}
</script>
