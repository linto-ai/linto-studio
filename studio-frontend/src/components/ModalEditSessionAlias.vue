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
import EMPTY_FIELD from "@/const/emptyField"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { createSessionAlias } from "@/api/session.js"

import { formsMixin } from "@/mixins/forms.js"

import ModalNew from "@/components/ModalNew.vue"
import FormInput from "@/components/FormInput.vue"
import LabeledValue from "@/components/LabeledValue.vue"

export default {
  mixins: [formsMixin],
  props: {
    organizationId: {
      type: String,
      default: "",
    },
    sessionId: {
      type: String,
      default: "",
    },
  },
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
    async confirm(e) {
      e?.preventDefault()
      if (this.testFields()) {
        const req = await createSessionAlias(this.organizationId, {
          sessionId: this.sessionId,
          name: this.nameField.value,
        })
        if (req.status === "success") {
          bus.$emit("app_notif", {
            status: "success",
            message: this.$t(
              "session.settings_page.modal_edit_session_alias.success_message",
            ),
            redirect: false,
          })
        } else {
          if (req.error.response.status === 409) {
            this.nameField.error = this.$t(
              "session.settings_page.modal_edit_session_alias.name_already_exists",
            )
          }
          bus.$emit("app_notif", {
            status: "error",
            message: this.$t(
              "session.settings_page.modal_edit_session_alias.error_message",
            ),
            redirect: false,
          })
        }
        //this.$emit("on-confirm", this.nameField.value)
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
